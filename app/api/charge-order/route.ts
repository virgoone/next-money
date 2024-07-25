import { NextResponse, type NextRequest } from "next/server";

import { currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { ChargeOrderHashids } from "@/db/dto/charge-order.dto";
import { chargeOrder } from "@/db/schema";
import { OrderPhase } from "@/db/type";
import { getErrorMessage } from "@/lib/handle-error";
import { redis } from "@/lib/redis";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const CreateChargeOrderSchema = z.object({
  currency: z.enum(["CNY", "USD"]).default("USD"),
  amount: z.number().min(100).max(1000000000),
  channel: z.enum(["GiftCode", "Stripe"]).default("Stripe"),
});
const billingUrl = absoluteUrl("/pricing");

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) {
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
    if (channel === "Stripe") {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: billingUrl,
        cancel_url: billingUrl,
        payment_method_types: ["card"],
        mode: "payment",
        billing_address_collection: "auto",
        customer_email: user.primaryEmailAddress.emailAddress,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Charge Order",
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        metadata: {
          orderId: ChargeOrderHashids.encode(newChargeOrder.newId),
          userId: user.id,
        },
      });
      return NextResponse.json({
        orderId: ChargeOrderHashids.encode(newChargeOrder.newId),
        url: stripeSession.url as string,
      });
    }
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
