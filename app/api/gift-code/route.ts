import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { ChargeOrderHashids } from "@/db/dto/charge-order.dto";
import {
  chargeOrder,
  giftCode,
  userCredit,
  userCreditTransaction,
} from "@/db/schema";
import { Currency, OrderPhase } from "@/db/type";
import { getErrorMessage } from "@/lib/handle-error";
import { redis } from "@/lib/redis";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const CreateGiftCodeOrderSchema = z.object({
  code: z.string().min(8),
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "5 s"),
  analytics: true,
});

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { userId } = auth();

  const user = await currentUser();
  if (!userId || !user || !user.primaryEmailAddress) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { success } = await ratelimit.limit(
    "gift-code:redeemed" + `_${req.ip ?? ""}`,
  );
  if (!success) {
    return new Response("Too Many Requests", {
      status: 429,
    });
  }

  try {
    const data = await req.json();
    const { code } = CreateGiftCodeOrderSchema.parse(data);
    const [giftCodeData] = await db
      .select()
      .from(giftCode)
      .where(eq(giftCode.code, code));
    if (!giftCodeData.id) {
      return new Response("gift code doesn't exist", {
        status: 400,
      });
    }
    if (giftCodeData.expiredAt && giftCodeData.expiredAt < new Date()) {
      return new Response("gift code has expired", {
        status: 400,
      });
    }
    if (giftCodeData.used) {
      return new Response("gift code has been used", {
        status: 400,
      });
    }
    await db.transaction(async (tx) => {
      await tx
        .insert(chargeOrder)
        .values({
          userId,
          userInfo: {
            fullName: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
            username: user.username,
          },
          currency: Currency.USD,
          amount: 0,
          credit: giftCodeData.creditAmount,
          channel: "GiftCode",
          phase: OrderPhase.Paid,
        })
        .returning({
          newId: chargeOrder.id,
        });
      const [newUserCredit] = await tx
        .update(userCredit)
        .set({
          credit: sql`${userCredit.credit} + ${giftCodeData.creditAmount}`,
        })
        .where(eq(userCredit.userId, userId))
        .returning({
          creditAmount: userCredit.credit,
        });
      const [transaction] = await tx
        .insert(userCreditTransaction)
        .values({
          userId: userId,
          credit: giftCodeData.creditAmount,
          balance: newUserCredit.creditAmount,
          type: "Charge",
        })
        .returning({
          transactionId: userCreditTransaction.id,
        });
      await tx
        .update(giftCode)
        .set({
          used: true,
          usedBy: userId,
          usedAt: new Date(),
          transactionId: transaction.transactionId,
        })
        .where(eq(giftCode.id, giftCodeData.id));
    });

    return NextResponse.json({
      message: "ok",
      creditAmount: giftCodeData.creditAmount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }
}
