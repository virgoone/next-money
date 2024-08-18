import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { z } from "zod";

import { prisma } from "@/db/prisma";
import { getUserCredit } from "@/db/queries/account";
import { BillingType, FluxTaskStatus } from "@/db/type";
import { env } from "@/env.mjs";
import { getErrorMessage } from "@/lib/handle-error";
import { logsnag } from "@/lib/log-snag";

const WebhookSchema = z.object({
  taskStatus: z.string(),
  replicateId: z.string(),
});

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const TASK_HEADER_KEY = env.TASK_HEADER_KEY;

  if (!TASK_HEADER_KEY) {
    throw new Error("Please add TASK_HEADER_KEY");
  }

  // Get the headers
  const headerPayload = headers();
  const webhookKey = headerPayload.get("next-money-webhook-key");

  // If there are no headers, error out
  if (!webhookKey || webhookKey! !== TASK_HEADER_KEY) {
    return new Response("Error occured -- no headers", {
      status: 400,
    });
  }

  // Get the body
  try {
    const payload = await req.json();
    const body = WebhookSchema.parse(payload);
    const { replicateId, taskStatus } = body;
    // Do something with the payload
    // For this guide, you simply log the payload to the console
    const fluxData = await prisma.fluxData.findFirst({
      where: {
        replicateId,
      },
    });
    if (!fluxData || !fluxData.id) {
      return NextResponse.json(
        { error: "Flux data not found" },
        { status: 404 },
      );
    }
    if (
      fluxData.taskStatus === FluxTaskStatus.Succeeded &&
      taskStatus !== FluxTaskStatus.Succeeded
    ) {
      return new Response("", { status: 200 });
    }
    const account = await getUserCredit(fluxData.userId);

    const billingData = await prisma.userBilling.findFirst({
      where: {
        AND: [
          {
            fluxId: fluxData.id,
          },
          {
            type: BillingType.Refund,
          },
        ],
      },
    });

    if (billingData) {
      return new Response("", { status: 200 });
    }

    await prisma.$transaction(async (tx) => {
      const billingData = await tx.userBilling.findFirst({
        where: {
          AND: [
            {
              fluxId: fluxData.id,
            },
            {
              type: BillingType.Withdraw,
            },
          ],
        },
      });
      if (!billingData) {
        throw new Error("Billing data not found");
      }

      const billingAmount = billingData.amount;
      const newBilling = await tx.userBilling.create({
        data: {
          userId: billingData.userId,
          state: "Done",
          amount: -billingAmount,
          type: BillingType.Refund,
          fluxId: fluxData.id,
          description: "Refund",
        },
      });

      await tx.userCreditTransaction.create({
        data: {
          userId: billingData.userId,
          credit: -billingAmount,
          billingId: newBilling.id,
          balance: account.credit - billingAmount,
          type: "Refund",
        },
      });
      await tx.userCredit.update({
        where: {
          id: account.id,
        },
        data: {
          credit: {
            decrement: billingAmount,
          },
        },
      });
    });
    await logsnag.track({
      channel: "refund",
      event: "Refund points",
      user_id: fluxData.userId,
      description: `用户绘画任务执行失败`,
      icon: "💰",
    });
  } catch (error) {
    console.log("error--->", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }

  return new Response("", { status: 200 });
}
