import { unstable_setRequestLocale } from "next-intl/server";

import BillingsInfo from "@/components/billing-info";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Billing – SaaS Starter",
  description: "Overview of your account and activities.",
});

type Props = {
  params: { locale: string };
};

export default async function DashboardPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  return <BillingsInfo />;
}
