import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import BillingsInfo from "@/components/billing-info";

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: PageProps) {
  const t = await getTranslations({ locale, namespace: "Billings" });

  return {
    title: t("page.title"),
    description: t("page.description"),
  };
}
export default async function DashboardPage({ params: { locale } }: PageProps) {
  unstable_setRequestLocale(locale);

  return <BillingsInfo />;
}
