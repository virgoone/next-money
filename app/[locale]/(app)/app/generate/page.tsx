import { Metadata } from "next";

import { unstable_setRequestLocale } from "next-intl/server";

import Playground from "@/components/playground";

export const metadata: Metadata = {
  title: "Playground",
  description: "The OpenAI Playground built using the components.",
};

type Props = {
  params: { locale: string };
};



export default function PlaygroundPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  return <Playground locale={locale} />;
}
