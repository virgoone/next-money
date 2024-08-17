import { Metadata } from "next";

import { unstable_setRequestLocale } from "next-intl/server";

import History from "@/components/history";

export const metadata: Metadata = {
  title: "History",
  description: "The OpenAI Playground built using the components.",
};

type Props = {
  params: { locale: string };
};



export default function PlaygroundPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  return <History locale={locale} />;
}
