import { getTranslations, setRequestLocale } from "next-intl/server";

import BillingsInfo from "@/components/billing-info";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Billings" });

  return {
    title: t("page.title"),
    description: t("page.description"),
  };
}
export default async function DashboardPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <BillingsInfo />;
}
