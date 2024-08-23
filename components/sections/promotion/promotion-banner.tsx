"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { debounce } from "lodash-es";
import { GiftIcon, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useReward } from "react-rewards";
import { toast } from "sonner";

import { PricingCardDialog } from "@/components/pricing-cards";
import { Button } from "@/components/ui/button";
import { ChargeProductSelectDto } from "@/db/type";

const usePostOfferMutation = (config?: {
  onSuccess: (result: any) => void;
}) => {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/offer", {
        method: "POST",
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (!res.ok && res.status >= 500) {
        throw new Error("Network response error");
      }

      return res.json();
    },
    onSuccess: async (result) => {
      config?.onSuccess(result);
    },
  });
};
export default function PromotionBanner({
  locale,
  claimed,
  chargeProduct,
}: {
  locale: string;
  claimed?: boolean;
  chargeProduct?: ChargeProductSelectDto[];
}) {
  const [isVisible, setIsVisible] = useState(false);
  const usePostOffer = usePostOfferMutation();
  const t = useTranslations("Promotion");
  const [loading, setLoading] = useState(false);
  const [pricingCardOpen, setPricingCardOpen] = useState(false);

  const { reward } = useReward("claim-success", "confetti", {
    position: "fixed",
    elementCount: 360,
    spread: 80,
    elementSize: 8,
    lifetime: 400,
  });

  useEffect(() => {
    // 组件挂载后，短暂延迟后显示 banner
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleClaim = async () => {
    try {
      if (!claimed) {
        setPricingCardOpen(true);
        toast.error(t("error.limit"));
        return;
      }
      setLoading(true);
      const res = await usePostOffer.mutateAsync();
      if (!res.error) {
        toast.success(t("success.title"));
        setTimeout(() => {
          reward();
        }, 600);
      } else {
        let error = res.error;
        if (res.code === 1000401) {
          setPricingCardOpen(true);
          error = t("error.limit") ?? res.error;
        }
        toast.error(error);
      }
    } catch (error) {
      toast.error("error.common");
    } finally {
      setLoading(false);
    }
  };
  const debounceHandleClaim = debounce(handleClaim, 900);

  if (!isVisible) return null;

  return (
    <div>
      <div
        className={`fixed bottom-0 left-0 right-0 z-10 bg-gradient-to-r from-purple-600 to-indigo-600 p-3 text-white shadow-lg transition-opacity duration-300 ease-in-out sm:p-4 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto flex flex-col items-center justify-between sm:flex-row">
          <div className="mb-2 flex items-center sm:mb-0">
            <GiftIcon className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
            <p className="text-xs sm:text-sm md:text-base">{t("title")}</p>
          </div>
          <div className="flex w-full space-x-2 sm:space-x-4 md:w-auto">
            <Button
              variant="secondary"
              id="claim-success"
              disabled={loading}
              className="flex-1 bg-white px-2 py-1 text-xs text-purple-600 hover:bg-gray-100 sm:px-4 sm:py-2 sm:text-sm"
              onClick={debounceHandleClaim}
            >
              {loading && <Loader2 className="icon-xs mr-1 animate-spin" />}
              {t("action.claim")}
            </Button>
            <Button
              variant="ghost"
              className="flex-1 px-2 py-1 text-xs text-white hover:bg-purple-700 sm:px-4 sm:py-2 sm:text-sm"
              onClick={handleClose}
            >
              {t("action.close")}
            </Button>
          </div>
        </div>
        <PricingCardDialog
          onClose={setPricingCardOpen}
          isOpen={pricingCardOpen}
          chargeProduct={chargeProduct}
        />
      </div>
      <div className="h-24" />
    </div>
  );
}
