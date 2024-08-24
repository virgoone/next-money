import { redirect } from "next/navigation";

import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import PromptGenerator from "@/components/prompt/generator";
import { PromptFaq } from "@/components/prompt/prompt-faq";

interface RootLayoutProps {
  params: { locale: string };
}
export async function generateMetadata({
  params: { locale },
}: Omit<RootLayoutProps, "children">) {
  const t = await getTranslations({ locale, namespace: "PromptGenerator" });

  return {
    title: t("layout.title"),
    description: t("layout.description"),
    keywords: t("layout.keywords"),
  };
}
export default async function ConfirmPage({
  params,
}: {
  params: { token: string; locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations({ namespace: "PromptGenerator" });

  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          <span>{t("title")}</span>
        </h1>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          {t("subtitle")}
        </p>

        <div
          className="w-full max-w-2xl"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <PromptGenerator />
        </div>
      </div>
      <PromptFaq />
    </section>
  );
}
