import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { z } from "zod";

import { ChargeOrderHashids } from "@/db/dto/charge-order.dto";
import { ChargeProductHashids } from "@/db/dto/charge-product.dto";
import { prisma } from "@/db/prisma";
import { OrderPhase } from "@/db/type";
import { getErrorMessage } from "@/lib/handle-error";
import { redis } from "@/lib/redis";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const CreateChargeOrderSchema = z.object({
  currency: z.enum(["CNY", "USD"]).default("USD"),
  productId: z.string(),
  amount: z.number().min(100).max(1000000000),
  channel: z.enum(["GiftCode", "Stripe"]).default("Stripe"),
  url: z.string().optional(),
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
    "charge-order:created" + `_${req.ip ?? ""}`,
  );
  if (!success) {
    return new Response("Too Many Requests", {
      status: 429,
    });
  }

  try {
    const data = await req.json();
    const { currency, amount, channel, productId, url } =
      CreateChargeOrderSchema.parse(data);
    if (channel !== "Stripe") {
      return NextResponse.json(
        { error: "Not Support Channel" },
        { status: 400 },
      );
    }
    const [chargeProductId] = ChargeProductHashids.decode(productId);
    const product = await prisma.chargeProduct.findFirst({
      where: {
        id: chargeProductId as number,
      },
    });
    if (!product) {
      return NextResponse.json(
        { error: "product not exists" },
        { status: 404 },
      );
    }
    const newChargeOrder = await prisma.chargeOrder.create({
      data: {
        userId: user.id,
        userInfo: {
          fullName: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          username: user.username,
        },
        currency,
        credit: product.credit,
        amount,
        channel,
        phase: OrderPhase.Pending,
      },
    });

    const orderId = ChargeOrderHashids.encode(newChargeOrder.id);
    const billingUrl = absoluteUrl(`/pricing?orderId=${orderId}`);
    const nextUrl = url?.includes("?")
      ? `${url}&orderId=${orderId}`
      : `${url}?orderId=${orderId}`;
    if (channel === "Stripe") {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: `${nextUrl ?? billingUrl}&success=true`,
        cancel_url: `${nextUrl ?? billingUrl}&success=false`,
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
        payment_intent_data: {
          metadata: {
            orderId,
            userId: user.id,
            chargeProductId: productId,
          },
        },
        metadata: {
          orderId,
          userId: user.id,
          chargeProductId: productId,
        },
      });
      return NextResponse.json({
        orderId,
        url: stripeSession.url as string,
      });
    }
    return NextResponse.json({
      orderId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }
}
