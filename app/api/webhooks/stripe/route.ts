import { headers } from "next/headers";

import { Prisma } from "@prisma/client";
import Stripe from "stripe";

import { ChargeOrderHashids } from "@/db/dto/charge-order.dto";
import { ChargeProductHashids } from "@/db/dto/charge-product.dto";
import { prisma } from "@/db/prisma";
import { getUserCredit } from "@/db/queries/account";
import { OrderPhase } from "@/db/type";
import { env } from "@/env.mjs";
import { logsnag } from "@/lib/log-snag";
import { stripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";

export async function GET() {
  return new Response("OK", { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (headers().get("Stripe-Signature") ||
    headers().get("stripe-signature")) as string;
  // const signature = stripe.webhooks.generateTestHeaderString({
  //   payload: body,
  //   secret: env.STRIPE_WEBHOOK_SECRET,
  // });
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
      // env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.log(`❌ Error message: ${error.message}`);
    return new Response(`Stripe Webhook Error: ${error.message}`, {
      status: 400,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // if (event.type === "checkout.session.completed") {
  //   // Retrieve the subscription details from Stripe.
  //   const subscription = await stripe.subscriptions.retrieve(
  //     session.subscription as string,
  //   );

  //   // Update the user stripe into in our database.
  //   // Since this is the initial subscription, we need to update
  //   // the subscription id and customer id.
  //   await db
  //     .update(userPaymentInfo)
  //     .set({
  //       stripeSubscriptionId: subscription.id,
  //       stripeCustomerId: subscription.customer as string,
  //       stripePriceId: subscription.items.data[0].price.id,
  //       stripeCurrentPeriodEnd: new Date(
  //         subscription.current_period_end * 1000,
  //       ),
  //     })
  //     .where(eq(userPaymentInfo.userId, session?.metadata?.userId as string));
  // }

  // if (event.type === "invoice.payment_succeeded") {
  //   // Retrieve the subscription details from Stripe.
  //   const subscription = await stripe.subscriptions.retrieve(
  //     session.subscription as string,
  //   );

  //   // Update the price id and set the new period end.
  //   await db
  //     .update(userPaymentInfo)
  //     .set({
  //       stripePriceId: subscription.items.data[0].price.id,
  //       stripeCurrentPeriodEnd: new Date(
  //         subscription.current_period_end * 1000,
  //       ),
  //     })
  //     .where(eq(userPaymentInfo.stripeSubscriptionId, subscription.id));
  // }
  if (event.type === "payment_intent.payment_failed") {
    const metaOrderId = session?.metadata?.orderId as string;
    const [orderId] = ChargeOrderHashids.decode(metaOrderId);
    if (!orderId) {
      return new Response(`Order Error`, { status: 400 });
    }
    const order = await prisma.chargeOrder.findUnique({
      where: {
        id: orderId as number,
      },
    });
    console.log("payment_failed order-->", order);
    if (!order || order.phase !== OrderPhase.Pending) {
      return new Response(`Order Phase Error`, { status: 400 });
    }
    await prisma.chargeOrder.update({
      where: {
        id: orderId as number,
      },
      data: {
        phase: OrderPhase.Failed,
        result: {
          ...session,
          failedAt: new Date(),
        } as unknown as Prisma.JsonObject,
      },
    });
  } else if (event.type === "payment_intent.canceled") {
    const metaOrderId = session?.metadata?.orderId as string;
    const [orderId] = ChargeOrderHashids.decode(metaOrderId);
    if (!orderId) {
      return new Response(`Order Error`, { status: 400 });
    }
    const order = await prisma.chargeOrder.findUnique({
      where: {
        id: orderId as number,
      },
    });
    console.log("canceled order-->", order);

    if (!order || order.phase !== OrderPhase.Pending) {
      return new Response(`Order Phase Error`, { status: 400 });
    }
    await prisma.chargeOrder.update({
      where: {
        id: orderId as number,
      },
      data: {
        phase: OrderPhase.Pending,
        result: {
          ...session,
          canceledAt: new Date(),
        } as unknown as Prisma.JsonObject,
      },
    });
  } else if (event.type === "payment_intent.succeeded") {
    const metaOrderId = session?.metadata?.orderId as string;
    const userId = session?.metadata?.userId as string;
    const metaChargeProductId = session?.metadata?.chargeProductId as string;
    const [orderId] = ChargeOrderHashids.decode(metaOrderId);
    const [chargeProductId] = ChargeProductHashids.decode(metaChargeProductId);
    if (!orderId || !chargeProductId) {
      return new Response(`Order Error`, { status: 400 });
    }
    const [order, product] = await Promise.all([
      prisma.chargeOrder.findUnique({
        where: {
          id: orderId as number,
        },
      }),
      prisma.chargeProduct.findUnique({
        where: {
          id: chargeProductId as number,
        },
      }),
    ]);
    console.log("payment succeeded order-->", order, product);
    if (
      !order ||
      !product ||
      !product?.id ||
      order.phase !== OrderPhase.Pending
    ) {
      return new Response(`Order Phase Error`, { status: 400 });
    }
    const account = await getUserCredit(userId);
    await prisma.$transaction(async (tx) => {
      const addCredit = product.credit;
      await tx.chargeOrder.update({
        where: {
          id: order.id,
        },
        data: {
          phase: "Paid",
          paymentAt: new Date(),
          result: session as unknown as Prisma.JsonObject,
        },
      });
      await tx.userCredit.update({
        where: {
          id: account.id,
        },
        data: {
          credit: {
            increment: addCredit,
          },
        },
      });

      await tx.userCreditTransaction.create({
        data: {
          userId: userId,
          credit: addCredit,
          balance: account.credit + addCredit,
          type: "Charge",
        },
      });
    });
    const price = formatPrice(product.amount)
    await logsnag.track({
      channel: "payments",
      event: "Successful Payment",
      user_id: userId,
      description: `用户购买积分：${product.title} - ${price}`,
      icon: "💰",
      tags: {
        title: product.title,
        amount: price,
      },
    });
  }

  return new Response(null, { status: 200 });
}
