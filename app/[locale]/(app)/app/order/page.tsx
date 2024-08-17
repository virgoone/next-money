import { unstable_setRequestLocale } from "next-intl/server";

import { OrderInfo } from "@/components/order-info";
import { constructMetadata } from "@/lib/utils";

type Props = {
  params: { locale: string };
};
export const metadata = constructMetadata({
  title: "Billing – SaaS Starter",
  description: "Manage billing and your subscription plan.",
});

export default async function BillingPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  return <OrderInfo />;
}
