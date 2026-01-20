import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import Playground from "@/components/playground";
import { getChargeProduct } from "@/db/queries/charge-product";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Playground" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PlaygroundPage({
  params,
}: PageProps) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  const { data: chargeProduct } = await getChargeProduct(locale);

  return <Playground locale={locale} chargeProduct={chargeProduct} />;
}
