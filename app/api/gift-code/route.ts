import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { z } from "zod";

import { ChargeOrderHashids } from "@/db/dto/charge-order.dto";
import { prisma } from "@/db/prisma";
import { getUserCredit } from "@/db/queries/account";

import { Currency, OrderPhase } from "@/db/type";
import { getErrorMessage } from "@/lib/handle-error";
import { redis } from "@/lib/redis";

const CreateGiftCodeOrderSchema = z.object({
  code: z.string().min(8),
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "5 s"),
  analytics: true,
});

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
    const giftCodeData = await prisma.giftCode.findFirst({
      where: {
        code,
      },
    });

    if (!giftCodeData || !giftCodeData?.id) {
      return new Response("gift code doesn't exist", {
        status: 400,
      });
    }
    if (giftCodeData?.expiredAt && giftCodeData?.expiredAt < new Date()) {
      return new Response("gift code has expired", {
        status: 400,
      });
    }
    if (giftCodeData.used) {
      return new Response("gift code has been used", {
        status: 400,
      });
    }
    const account = await getUserCredit(userId);

    await prisma.$transaction(async (tx) => {
      await tx.chargeOrder.create({
        data: {
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
        },
      });

      const newUserCredit = await tx.userCredit.update({
        where: {
          id: account.id,
        },
        data: {
          credit: {
            increment: giftCodeData.creditAmount,
          },
        },
      });
      const transaction = await tx.userCreditTransaction.create({
        data: {
          userId: userId,
          credit: giftCodeData.creditAmount,
          balance: newUserCredit.credit,
          type: "Charge",
        },
      });

      await tx.giftCode.update({
        where: {
          id: giftCodeData.id,
        },
        data: {
          used: true,
          usedBy: userId,
          usedAt: new Date(),
          transactionId: transaction.id,
        },
      });
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
