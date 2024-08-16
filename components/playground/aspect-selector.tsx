"use client";

import * as React from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SelectorProps {
  ratio: Ratio;
  onChange: (ratio: Ratio) => void;
}

export enum Ratio {
  r1 = "1:1",
  r2 = "16:9",
  r3 = "9:16",
  r4 = "3:2",
  r5 = "2:3",
}

const aspectRatios = [Ratio.r1, Ratio.r2, Ratio.r3, Ratio.r4, Ratio.r5];

export function AspectRatioSelector({ ratio, onChange }: SelectorProps) {
  return (
    <Tabs value={ratio} onValueChange={(value) => onChange(value as Ratio)}>
      <div className="grid gap-2">
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              AspectRatio
            </span>
          </HoverCardTrigger>
          <HoverCardContent className="w-[320px] text-sm" side="left">
            Choose the interface that best suits your task. You can provide: a
            simple prompt to complete, starting and ending text to insert a
            completion within, or some text with instructions to edit it.
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
