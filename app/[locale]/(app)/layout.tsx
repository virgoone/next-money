import { unstable_setRequestLocale } from "next-intl/server";

import UserPoints from "@/components/dashboard/points";
import { SearchCommand } from "@/components/dashboard/search-command";
import {
  DashboardSidebar,
  MobileSheetSidebar,
} from "@/components/layout/dashboard-sidebar";
import { DashboardNav } from "@/components/layout/dashboard-sidenav";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { NavBar, NavbarUserInfo } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { dashboardConfig } from "@/config/dashboard";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  params: { locale: string };
}
{
  /* <div className="flex min-h-screen flex-col space-y-6">
      <NavBar />

      <MaxWidthWrapper className="min-h-svh">
        <div className="grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
          <aside className="hidden w-[200px] flex-col md:flex">
            <DashboardNav items={dashboardConfig.sidebarNav} />
            <div className="w-full flex-1">
              <SearchCommand links={dashboardConfig.sidebarNav} />
            </div>
          </aside>
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </MaxWidthWrapper>
      <SiteFooter className="border-t" />
    </div> */
}
export default function DashboardLayout({
  children,
  params: { locale },
}: DashboardLayoutProps) {
  unstable_setRequestLocale(locale);

  const filteredLinks = dashboardConfig.sidebarNav.map((section) => ({
    ...section,
  }));

  return (
    <MaxWidthWrapper className="max-w-[1650px] px-0">
      <div className="relative flex min-h-screen w-full">
        <DashboardSidebar links={filteredLinks} />

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-50 flex h-14 items-center gap-3 bg-background px-4 lg:h-[60px] xl:px-10">
            <MobileSheetSidebar links={filteredLinks} />

            <div className="w-full flex-1">
              <div className="hidden md:block">
                <SearchCommand links={filteredLinks} />
              </div>
            </div>

            {/* <Notifications /> */}
            <UserPoints />
            <ModeToggle />
            <NavbarUserInfo />
          </header>

          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 xl:px-10">
            {children}
          </main>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
