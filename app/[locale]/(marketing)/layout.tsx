import { unstable_setRequestLocale } from "next-intl/server";

import { NavMobile } from "@/components/layout/mobile-nav";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";

interface MarketingLayoutProps {
  children: React.ReactNode;
  locale: string;
}

export default function MarketingLayout({
  children,
  locale,
}: MarketingLayoutProps) {
  unstable_setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <NavMobile />
      <NavBar scroll={true} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
