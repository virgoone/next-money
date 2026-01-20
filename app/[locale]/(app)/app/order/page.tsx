import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { OrderInfo } from "@/components/order-info";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Orders" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function BillingPage({ params }: PageProps) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  return <OrderInfo />;
}
