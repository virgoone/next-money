import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { PricingCards } from "@/components/pricing-cards";
import { PricingFaq } from "@/components/pricing-faq";
import { getChargeProduct } from "@/db/queries/charge-product";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale });
  return {
    title: `${t("PricingPage.title")} - ${t("LocaleLayout.title")}`,
    description: t("LocaleLayout.description"),
  };
}

export default async function PricingPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  const { data: chargeProduct = [] } = await getChargeProduct(locale);

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <PricingCards chargeProduct={chargeProduct} />
      <hr className="container" />
      <PricingFaq />
    </div>
  );
}
