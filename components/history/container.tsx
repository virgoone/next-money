import React from "react";
import { cn } from "@/lib/utils";

export default function HistoryContainer(props: { children: React.ReactNode, className?: string }) {
  return (
    <section className={cn("h-[calc(100vh_-_76px)] overflow-hidden", props.className)}>
      {props.children}
    </section>
  );
}
