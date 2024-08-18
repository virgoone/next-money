"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Locale, locales } from "@/config";
import { usePathname, useRouter } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const pathname = usePathname();
  const params = useParams();

  const changeLocale = (nextLocale: Locale) => {
    startTransition(() => {
      router.replace(
        {
          pathname,
          // @ts-expect-error -- TypeScript will validate that only known `params`
          // are used in combination with a given `pathname`. Since the two will
          // always match for the current route, we can skip runtime checks.
          params,
        },
        { locale: nextLocale },
      );
    });
  };

  return (
    <div className="flex h-full items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="size-8 px-0">
            <Icons.Languages className="rotate-0 scale-100 transition-all" />
            <span className="sr-only">{t("label")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {locales.map((cur) => (
            <DropdownMenuItem
              disabled={isPending}
              key={cur}
              onClick={() => changeLocale(cur)}
            >
              <span>{t("locale", { locale: cur })}</span>
              {locale === cur && (
                <Icons.CheckIcon
                  className={cn("ml-auto h-4 w-4 opacity-100")}
                />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
