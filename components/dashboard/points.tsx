"use client";

import { useState } from "react";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { WalletIcon } from "lucide-react";

import { ChargeProductSelectDto } from "@/db/type";

import NumberTicker from "../magicui/number-ticker";
import { PricingCardDialog } from "../pricing-cards";

interface PageProps {
  chargeProduct?: ChargeProductSelectDto[];
}

export default function UserPoints({ chargeProduct }: PageProps) {
  const { getToken } = useAuth();
  const [pricingCardOpen, setPricingCardOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["queryUserPoints"],
    queryFn: async () => {
      return fetch(`/api/account`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      }).then((res) => res.json());
    },
  });
  return (
    <>
      <div
        onClick={() => setPricingCardOpen(true)}
        className="flex cursor-pointer items-center gap-1 text-sm font-medium text-muted-foreground"
      >
        <WalletIcon className="h-4 w-4" />
        <NumberTicker value={data?.credit || 0} />
      </div>
      <PricingCardDialog
        onClose={setPricingCardOpen}
        isOpen={pricingCardOpen}
        chargeProduct={chargeProduct}
      />
    </>
  );
}
