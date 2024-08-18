import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { OrderInfo } from "@/components/order-info";

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: PageProps) {
  const t = await getTranslations({ locale, namespace: "Orders" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function BillingPage({ params: { locale } }: PageProps) {
  unstable_setRequestLocale(locale);

  return <OrderInfo />;
}
