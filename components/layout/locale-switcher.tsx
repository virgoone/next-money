"use client";

import * as React from "react";

import { useTheme } from "next-themes";

import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales } from "@/config";
import { useLocale, useTranslations } from "next-intl";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="size-8 px-0">
          <Icons.sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Icons.moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((cur) => (
          <DropdownMenuItem key={cur} onClick={() => setTheme("light")}>
            <Icons.sun className="mr-2 size-4" />
            <span>{cur}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
