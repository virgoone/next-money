import Image from "next/image";

import { MarqueeList } from "@/components/marquee-list";
import { HeaderSection } from "@/components/shared/header-section";

export default function Testimonials() {
  return (
    <section>
      <div className="container flex max-w-6xl flex-col gap-10 py-32 sm:gap-y-16">
        <HeaderSection
          label="Testimonials"
          title="What our clients are sharing."
          subtitle="Discover the glowing feedback from our delighted customers
            worldwide."
        />

        <div className="w-full">
          <MarqueeList />
        </div>
      </div>
    </section>
  );
}
