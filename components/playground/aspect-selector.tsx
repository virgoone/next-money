"use client";

import * as React from "react";

import { useTranslations } from "next-intl";

import { Ratio } from "@/config/constants";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SelectorProps {
  ratio: Ratio;
  aspectRatios: Ratio[];
  className?:string
  onChange: (ratio: Ratio) => void;
}

export function AspectRatioSelector({ aspectRatios, ratio, onChange }: SelectorProps) {
  const t = useTranslations("Playground");

  return (
    <Tabs value={ratio} onValueChange={(value) => onChange(value as Ratio)}>
      <div className="grid gap-2">
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <span className="text-left text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t("form.aspectRatio")}
            </span>
          </HoverCardTrigger>
          <HoverCardContent className="w-[320px] text-sm" side="left">
            {t("form.aspectRatioTooltip")}
          </HoverCardContent>
        </HoverCard>

        <TabsList className="grid grid-cols-5">
          {aspectRatios.map((ratio) => (
            <TabsTrigger key={ratio} value={ratio}>
              {ratio}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
