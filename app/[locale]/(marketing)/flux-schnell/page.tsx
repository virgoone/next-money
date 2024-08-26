import { redirect } from "next/navigation";

import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import FluxFreeGenerator from "@/components/playground/flux-free";
import { PlaygroundFaq } from "@/components/playground/playground-faq";
import { getChargeProduct } from "@/db/queries/charge-product";

interface RootLayoutProps {
  params: { locale: string };
}
export async function generateMetadata({
  params: { locale },
}: Omit<RootLayoutProps, "children">) {
  const t = await getTranslations({ locale, namespace: "Playground" });

  return {
    title: t("layout.title", { model: "Schnell" }),
    description: t("layout.description"),
    keywords: t("layout.keywords"),
  };
}
export default async function ConfirmPage({
  params,
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations({ namespace: "Playground" });
  const { data: chargeProduct } = await getChargeProduct(params.locale);

  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
        <h1 className="text-balance font-urban text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-[56px]">
          {t("page.title", { model: "Schnell" })}
        </h1>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          {t("page.subtitle")}
        </p>

        <div
          className="w-full max-w-2xl"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <FluxFreeGenerator
            locale={params.locale}
            chargeProduct={chargeProduct}
          />
        </div>
      </div>
      <PlaygroundFaq />
    </section>
  );
}
