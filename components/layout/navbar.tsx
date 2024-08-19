"use client";

import { useContext } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { useTranslations } from "next-intl";

import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardConfig } from "@/config/dashboard";
import { docsConfig } from "@/config/docs";
import { marketingConfig } from "@/config/marketing";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

import { UserInfo } from "../user-info";

interface NavBarProps {
  scroll?: boolean;
  large?: boolean;
}

export function NavbarLogo(props: { size?: "sm" | "md" | "lg" | "xl" }) {
  const t = useTranslations("Navigation");
  const { size = "xl" } = props;
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Icons.logo className="hidden h-6 w-6 md:block" />
      <span className={cn("font-urban font-bold", `text-xs md:text-${size}`)}>
        {t("title")}
      </span>
    </Link>
  );
}

export function NavbarUserInfo() {
  return (
    <div className="flex items-center space-x-3">
      <UserInfo />
    </div>
  );
}

export function NavBar({ scroll = false }: NavBarProps) {
  const scrolled = useScroll(50);
  const t = useTranslations("Navigation");
  const selectedLayout = useSelectedLayoutSegment();
  const dashBoard = selectedLayout === "dashboard";
  const blog = selectedLayout === "(blog)";
  const documentation = selectedLayout === "docs";
  const links = documentation
    ? docsConfig.mainNav
    : dashBoard
      ? dashboardConfig.mainNav
      : marketingConfig.mainNav;

  return (
    <header
      className={`sticky top-0 z-40 pr-9 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all md:pr-0 ${
        scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
      }`}
    >
      <MaxWidthWrapper
        className="flex h-14 items-center justify-between py-4"
        large={documentation}
      >
        <div className="flex gap-6 md:gap-10">
          <NavbarLogo />

          {links && links.length > 0 ? (
            <nav className="hidden gap-6 md:flex">
              {links.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? "#" : item.href}
                  prefetch={true}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                    item.href.startsWith(`/${selectedLayout}`) ||
                      (item.href === "/blog" && blog)
                      ? "text-foreground"
                      : "text-foreground/60",
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                >
                  {t(item.title)}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>

        <NavbarUserInfo />
      </MaxWidthWrapper>
    </header>
  );
}
