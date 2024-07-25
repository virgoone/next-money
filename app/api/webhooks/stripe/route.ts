import { headers } from "next/headers";
import { chargeOrder, userPaymentInfo } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

import { env } from "@/env.mjs";
import { stripe } from "@/lib/stripe";
import { ChargeOrderHashids } from "@/db/dto/charge-order.dto";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
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
  if (event.type === "payment_intent.succeeded") {
    console.log('session--->', session)
    // const metaOrderId =  session?.metadata?.orderId as string; 
    // const [orderId] = ChargeOrderHashids.decode(metaOrderId)
    // const [order] = await db.select().from(chargeOrder).where(eq(chargeOrder.id, orderId as number))
    // if (!order || order.phase !== "Pending") {
    //   return new Response(`Order Phase Error`, { status: 400 });
    // }
  }

  return new Response(null, { status: 200 });
}
