import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import Playground from "@/components/playground";

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: PageProps) {
  const t = await getTranslations({ locale, namespace: "Playground" });

  return {
    title: t("title"),
    description: t("description"),
  };
}


export default function PlaygroundPage({ params: { locale } }: PageProps) {
  unstable_setRequestLocale(locale);

  return <Playground locale={locale} />;
}
