import { currentUser } from "@clerk/nextjs/server";
import { unstable_setRequestLocale } from "next-intl/server";

import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { PricingCards } from "@/components/pricing-cards";
import { PricingFaq } from "@/components/pricing-faq";

export const metadata = constructMetadata({
  title: "Pricing – SaaS Starter",
  description: "Explore our subscription plans.",
});
type Props = {
  params: { locale: string };
};
export default async function PricingPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  const user = await currentUser();
  let subscriptionPlan;

  if (user) {
    subscriptionPlan = await getUserSubscriptionPlan(user.id, user);
  }

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <PricingCards userId={user?.id} subscriptionPlan={subscriptionPlan} />
      <hr className="container" />
      <PricingFaq />
    </div>
  );
}
