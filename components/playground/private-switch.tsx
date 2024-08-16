"use client";

import * as React from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function PrivateSwitch(props: {
  isPublic: boolean;
  onChange: (isPublic: boolean) => void;
}) {
  const { isPublic, onChange } = props;
  return (
    <div className="grid gap-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              onCheckedChange={onChange}
              checked={isPublic}
            />
            <Label htmlFor="isPublic">{isPublic ? "Public" : "Private"}</Label>
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          The model which will generate the completion. Some models are suitable
          for natural language tasks, others specialize in code. Learn more.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
