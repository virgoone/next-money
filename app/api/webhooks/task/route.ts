import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { getUserCredit } from "@/db/queries/account";
import {
  BillingType,
  flux,
  FluxTaskStatus,
  userBilling,
  userCredit,
  userCreditTransaction,
} from "@/db/schema";
import { env } from "@/env.mjs";
import { getErrorMessage } from "@/lib/handle-error";
import { logsnag } from "@/lib/log-snag";

const WebhookSchema = z.object({
  taskStatus: z.string(),
  replicateId: z.string(),
});

export const runtime = "edge";

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
    const [fluxData] = await db
      .select()
      .from(flux)
      .where(eq(flux.replicateId, replicateId));
    if (!fluxData) {
      return NextResponse.json(
        { error: "Flux data not found" },
        { status: 404 },
      );
    }
    if (
      fluxData.taskStatus === FluxTaskStatus.Succeeded ||
      taskStatus !== FluxTaskStatus.Succeeded
    ) {
      return new Response("", { status: 200 });
    }
    const [billingData] = await db
      .select()
      .from(userBilling)
      .where(
        and(
          eq(userBilling.fluxId, fluxData.id),
          eq(userBilling.type, BillingType.Refund),
        ),
      );
    if (billingData) {
      return new Response("", { status: 200 });
    }

    await db.transaction(async (tx) => {
      const [billingData] = await tx
        .select()
        .from(userBilling)
        .where(
          and(
            eq(userBilling.fluxId, fluxData.id),
            eq(userBilling.type, BillingType.Withdraw),
          ),
        );
      const account = await getUserCredit(billingData.userId);

      const billingAmount = billingData.amount;
      const [newBilling] = await tx
        .insert(userBilling)
        .values({
          userId: billingData.userId,
          state: "Done",
          amount: -billingAmount,
          type: BillingType.Refund,
          fluxId: fluxData.id,
          description: "Refund",
        })
        .returning({
          newId: userBilling.id,
        });
      await tx.insert(userCreditTransaction).values({
        userId: billingData.userId,
        credit: -billingAmount,
        billingId: newBilling.newId,
        balance: account.credit - billingAmount,
        type: "Refund",
      });
      await tx
        .update(userCredit)
        .set({
          credit: sql`${userCredit.credit} - ${billingAmount}`,
        })
        .where(eq(userCredit.id, account.id));
    });
    await logsnag.track({
      channel: "refund",
      event: "Refund points",
      user_id: fluxData.userId,
      description: `用户绘画任务执行失败`,
      icon: "💰",
    });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }

  return new Response("", { status: 200 });
}
