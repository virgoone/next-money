import Image from "next/image";

import { useTranslations } from "next-intl";

import { MarqueeList } from "@/components/sections/marquee-list";
import { HeaderSection } from "@/components/shared/header-section";

export default function Examples() {
  const t = useTranslations("IndexPage");

  return (
    <section>
      <div className="container flex max-w-7xl flex-col gap-10 py-4 sm:gap-y-4 mb-4">
        <HeaderSection
          title={t("examples.title")}
          subtitle={t("examples.subtitle")}
        />

        <div className="w-full">
          <MarqueeList />
        </div>
      </div>
    </section>
  );
}
