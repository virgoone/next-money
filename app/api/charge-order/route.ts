import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { ChargeOrderHashids } from "@/db/dto/charge-order.dto";
import { chargeOrder } from "@/db/schema";
import { OrderPhase } from "@/db/type";
import { currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getErrorMessage } from "@/lib/handle-error";
import { redis } from "@/lib/redis";

const CreateChargeOrderSchema = z.object({
  currency: z.enum(["CNY", "USD"]).default("USD"),
  amount: z.number().min(100).max(1000000000),
  channel: z.enum(["GiftCode", "Stripe"]).default("Stripe"),
});

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(2, "5 s"),
    analytics: true,
  });
  const { success } = await ratelimit.limit(
    "charge-order:created" + `_${req.ip ?? ""}`,
  );
  if (!success) {
    return new Response("Too Many Requests", {
      status: 429,
    });
  }

  try {
    const data = await req.json();
    const { currency, amount, channel } = CreateChargeOrderSchema.parse(data);
    const [newChargeOrder] = await db
      .insert(chargeOrder)
      .values({
        userId: user.id,
        userInfo: {
          fullName: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          username: user.username,
        },
        currency,
        amount,
        channel,
        phase: OrderPhase.Pending,
      })
      .returning({
        newId: chargeOrder.id,
      });
    return NextResponse.json({
      orderId: ChargeOrderHashids.encode(newChargeOrder.newId),
    });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }
}