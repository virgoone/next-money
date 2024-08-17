import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";

import { DashboardIcon, UserArrowLeftIcon } from "@/assets";
import { Icons } from "@/components/shared/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Link } from "@/lib/navigation";
import { cn, nFormatter } from "@/lib/utils";

import ShimmerButton from "../forms/shimmer-button";
import AnimatedGradientText from "../magicui/animated-gradient-text";
import { Eraser } from "lucide-react";

export default async function HeroLanding() {
  const t = await getTranslations({ namespace: "IndexPage" });

  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
        {/* Want animations? Check here: https://github.com/mickasmt/next-saas-stripe-starter/blob/76eb9f2b70b29c7a734ff0e5b047796ed2dac28d/app/(marketing)/page.tsx */}
        <Link
          href="https://twitter.com/miickasmt/status/1719892161095745801"
          target="_blank"
        >
          <AnimatedGradientText>
            <span className="mr-3">🎉</span>
            <span
              className={cn(
                `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
              )}
            >
              {t("intro")}
            </span>
            <Icons.twitter className="ml-2 size-3.5" />
          </AnimatedGradientText>
        </Link>

        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          <span>{t("subtitle")}</span>
          <br/>
          <span className="text-gradient_indigo-purple font-extrabold">
            {t("title")}
          </span>
        </h1>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          {t("description")}
        </p>

        <div
          className="flex flex-col justify-center space-y-4 md:flex-row md:space-x-4 md:space-y-0"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <SignedIn>
            <Link
              className="group relative w-full max-w-52 items-center justify-center gap-2 overflow-hidden whitespace-pre rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-all duration-300 ease-out hover:bg-primary/90 hover:ring-2 hover:ring-primary hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 md:flex"
              href="/app/generate"
            >
              <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40" />
              <div className="flex items-center">
                <Eraser className="mr-2 size-4" />
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 dark:text-slate-900">
                  {t("action.generate")}
                </span>
              </div>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="redirect">
              <Button
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "min-w-32 gap-2 rounded-full",
                )}
              >
                <UserArrowLeftIcon className="mr-2 size-4" />
                <span>{t("action.login")}</span>
              </Button>
            </SignInButton>
          </SignedOut>

          <Link
            href="/pricing"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
              }),
              "min-w-32 px-5 rounded-full",
            )}
          >
            <p>{t("action.pricing")}</p>
            <Icons.arrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
