import React from "react";

export default function HistoryContainer(props: { children: React.ReactNode }) {
  return (
    <section className="h-[calc(100vh_-_76px)] overflow-hidden">
      {props.children}
    </section>
  );
}
