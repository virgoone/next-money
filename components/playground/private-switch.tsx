"use client";

import * as React from "react";

import { useTranslations } from "next-intl";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function PrivateSwitch(props: {
  isPublic: boolean;
  disabled?: boolean;
  onChange: (isPublic: boolean) => void;
}) {
  const { isPublic, disabled, onChange } = props;
  const t = useTranslations("Playground");

  return (
    <div className="grid gap-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              onCheckedChange={onChange}
              checked={isPublic}
              disabled={disabled}
            />
            <Label htmlFor="isPublic">
              {t("settings.display", {
                mode: isPublic ? "Public" : "Private",
              })}
            </Label>
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          {t("settings.displayTooltip")}
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
