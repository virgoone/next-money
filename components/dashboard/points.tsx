"use client";

import React, { useState } from "react";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { WalletIcon } from "lucide-react";

import NumberTicker from "../magicui/number-ticker";

export default function UserPoints() {
  const { getToken } = useAuth();

  const { data } = useQuery({
    queryKey: ["queryUserPoints"],
    queryFn: async () => {
      return fetch(`/api/account`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      }).then((res) => res.json());
    },
  });
  return (
    <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
      <WalletIcon className="h-4 w-4" />
      <NumberTicker value={data?.credit || 0} />
    </div>
  );
}
