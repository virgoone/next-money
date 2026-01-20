import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import History from "@/components/history";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "History" });

  return {
    title: t("title"),
    description: t("description"),
  };
}



export default async function PlaygroundPage({ params }: PageProps) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  return <History locale={locale} />;
}
