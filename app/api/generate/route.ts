import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import dayjs from "dayjs";
import { z } from "zod";

import { Credits, model, Ratio } from "@/config/constants";
import { FluxHashids } from "@/db/dto/flux.dto";
import { prisma } from "@/db/prisma";
import { getUserCredit } from "@/db/queries/account";
import { BillingType } from "@/db/type";
import { env } from "@/env.mjs";
import { getErrorMessage } from "@/lib/handle-error";
import { redis } from "@/lib/redis";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});

function getKey(id: string) {
  return `generate:${id}`;
}

export const maxDuration = 60;

type Params = { params: { key: string } };
const CreateGenerateSchema = z.object({
  model: z.enum([
    model.pro,
    model.schnell,
    model.dev,
    model.general,
    model.freeSchnell,
  ]),
  inputPrompt: z.string(),
  aspectRatio: z.enum([
    Ratio.r1,
    Ratio.r2,
    Ratio.r3,
    Ratio.r4,
    Ratio.r5,
    Ratio.r6,
    Ratio.r7,
  ]),
  isPrivate: z.number().default(0),
  locale: z.string().default("en"),
  loraName: z.string().optional(),
  inputImageUrl: z.string().url().optional(),
});

export async function POST(req: NextRequest, { params }: Params) {
  const { userId } = auth();

  const user = await currentUser();
  if (!userId || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (env.APP_ENV !== "production" && !user.publicMetadata.siteOwner) {
    return NextResponse.json({ error: "no permission" }, { status: 403 });
  }

  const { success } = await ratelimit.limit(
    getKey(user.id) + `_${req.ip ?? ""}`,
  );
  if (!success) {
    return new Response("Too Many Requests", {
      status: 429,
    });
  }

  try {
    const data = await req.json();
    const {
      model: modelName,
      inputPrompt,
      aspectRatio,
      isPrivate,
      locale,
      loraName,
      inputImageUrl,
    } = CreateGenerateSchema.parse(data);
    const headers = new Headers();
    if (modelName === model.freeSchnell) {
      const thisMonthStart = dayjs().startOf("M");
      const thisMonthEnd = dayjs().endOf("M");
      const freeSchnellCount = await prisma.fluxData.count({
        where: {
          model: model.freeSchnell,
          userId,
          createdAt: {
            gte: thisMonthStart.toDate(),
            lte: thisMonthEnd.toDate(),
          },
        },
      });
      // 5 free schnell generate per month
      if (freeSchnellCount >= 5 && !user.publicMetadata.siteOwner) {
        return NextResponse.json(
          { error: "Insufficient credit", code: 1000403 },
          { status: 400 },
        );
      }
    }
    const account = await getUserCredit(userId);
    const needCredit = Credits[modelName];
    if (
      (!account.credit && modelName !== model.freeSchnell) ||
      account.credit < needCredit
    ) {
      return NextResponse.json(
        { error: "Insufficient credit", code: 1000402 },
        { status: 400 },
      );
    }

    headers.append("Content-Type", "application/json");
    headers.append("API-TOKEN", env.FLUX_HEADER_KEY);

    const res = await fetch(`${env.FLUX_CREATE_URL}/flux/create`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: modelName,
        input_image_url: inputImageUrl,
        input_prompt: inputPrompt,
        aspect_ratio: aspectRatio,
        is_private: isPrivate,
        user_id: userId,
        lora_name: loraName,
        locale,
      }),
    }).then((res) => res.json());
    if (!res?.replicate_id && res.error) {
      return NextResponse.json({ error: "Create Generator Error" }, { status: 400 });
    }
    const fluxData = await prisma.fluxData.findFirst({
      where: {
        replicateId: res.replicate_id,
      },
    });
    if (!fluxData) {
      return NextResponse.json({ error: "Create Task Error" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      const newAccount = await tx.userCredit.update({
        where: { id: account.id },
        data: {
          credit: {
            decrement: needCredit,
          },
        },
      });
      const billing = await tx.userBilling.create({
        data: {
          userId,
          fluxId: fluxData.id,
          state: "Done",
          amount: -needCredit,
          type: BillingType.Withdraw,
          description: `Generate ${modelName} - ${aspectRatio} Withdraw`,
        },
      });

      await tx.userCreditTransaction.create({
        data: {
          userId,
          credit: -needCredit,
          balance: newAccount.credit,
          billingId: billing.id,
          type: "Generate",
        },
      });
    });
    return NextResponse.json({ id: FluxHashids.encode(fluxData.id) });
  } catch (error) {
    console.log("error-->", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }
}
