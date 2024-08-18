"use client";

import React from "react";
import { usePathname } from "next/navigation";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { useTranslations } from "next-intl";

import {
  GitHubBrandIcon,
  GoogleBrandIcon,
  MailIcon,
  UserArrowLeftIcon,
} from "@/assets";
import ShimmerButton from "@/components/forms/shimmer-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { url } from "@/lib";
import { clamp } from "@/lib/math";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { LocaleSwitcher } from "./layout/locale-switcher";

export function UserInfo() {
  const t = useTranslations("Navigation");

  const pathname = usePathname();
  const { user } = useUser();
  const StrategyIcon = React.useMemo(() => {
    const strategy = user?.primaryEmailAddress?.verification.strategy;
    if (!strategy) {
      return null;
    }

    switch (strategy) {
      case "from_oauth_github":
        return GitHubBrandIcon as (
          props: React.ComponentProps<"svg">,
        ) => JSX.Element;
      case "from_oauth_google":
        return GoogleBrandIcon;
      default:
        return MailIcon;
    }
  }, [user?.primaryEmailAddress?.verification.strategy]);

  return (
    <AnimatePresence>
      <SignedIn key="user-info">
        <div className="flex items-center space-x-3">
          <LocaleSwitcher />
          <motion.div
            className="pointer-events-auto relative flex h-10 items-center"
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 25 }}
          >
            <UserButton
              afterSignOutUrl={url(pathname).href}
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 ring-2 ring-white/20",
                },
              }}
            />
            {StrategyIcon && (
              <span className="pointer-events-none absolute -bottom-1 -right-1 flex h-4 w-4 select-none items-center justify-center rounded-full bg-white dark:bg-zinc-900">
                <StrategyIcon className="h-3 w-3" />
              </span>
            )}
          </motion.div>
          {!pathname?.includes("app") && (
            <Link href="/app" className="size-full">
              <ShimmerButton>
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10">
                  {t("dashboard")}
                </span>
              </ShimmerButton>
            </Link>
          )}
        </div>
      </SignedIn>
      <SignedOut key="sign-in">
        <motion.div
          className="pointer-events-auto"
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 25 }}
        >
          <TooltipProvider>
            <Tooltip>
              <SignInButton mode="modal" forceRedirectUrl={url(pathname).href}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="group h-10 rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-3 text-sm shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
                  >
                    <UserArrowLeftIcon className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
              </SignInButton>

              <TooltipContent>
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  {t("tooltip.login")}
                </motion.div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      </SignedOut>
    </AnimatePresence>
  );
}
