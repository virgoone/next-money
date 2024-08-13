import { unstable_setRequestLocale } from "next-intl/server";

import BentoGrid from "@/components/sections/bentogrid";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import InfoLanding from "@/components/sections/info-landing";
import Powered from "@/components/sections/powered";
import PreviewLanding from "@/components/sections/preview-landing";
import PricingCard from "@/components/sections/pricing-card";
import Testimonials from "@/components/sections/testimonials";
import TwitterList from "@/components/sections/twitter-list";
import { infos } from "@/config/landing";

type Props = {
  params: { locale: string };
};

export default function IndexPage({ params: { locale } }: Props) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  return (
    <>
      <HeroLanding />
      <PreviewLanding />
      {/* <Powered /> */}
      {/* <BentoGrid /> */}
      {/* <InfoLanding data={infos[0]} reverse={true} /> */}
      {/* <InfoLanding data={infos[1]} /> */}
      {/* <Features /> */}
      <Testimonials />
      <TwitterList />
      <PricingCard />
    </>
  );
}
