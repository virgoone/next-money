"use client";

import React, { useState, useTransition } from "react";

import { useAuth } from "@clerk/nextjs";
import { ArrowDownToLine, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/handle-error";

export function DownloadAction({
  id,
  disabled,
}: {
  id: string;
  disabled?: boolean;
}) {
  const t = useTranslations("History");
  const [isDownloading, startDownloadTransition] = useTransition();
  const [isPending, setIsPending] = useState(false);
  const { getToken } = useAuth();

  const download = async (id: string) => {
    if (isDownloading || isPending) {
      return;
    }
    startDownloadTransition(() => {
      toast.promise(
        async () => {
          setIsPending(true);
          const blob = await fetch(`/api/download?fluxId=${id}`, {
            headers: {
              Authorization: `Bearer ${await getToken()}`,
            },
          }).then((response) => response.blob());
          console.log("blob-->", blob);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${id}_fluxaipro.art.${blob.type.split("/")?.[1]}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
        {
          loading: t("action.downloadLoading"),
          success: () => {
            setIsPending(false);
            return t("action.downloadSuccess");
          },
          error: (error) => {
            setIsPending(false);
            return getErrorMessage(error);
          },
        },
      );
    });
  };

  return (
    <button
      aria-label={t("action.download")}
      disabled={disabled}
      className="focus-ring text-content-strong border-stroke-strong hover:border-stroke-stronger data-[state=open]:bg-surface-alpha-light inline-flex h-8 items-center justify-center whitespace-nowrap rounded-lg border bg-transparent px-2.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
      onClick={() => download(id!)}
    >
      {isDownloading || isPending ? (
        <Loader2 className="icon-xs animate-spin" />
      ) : (
        <ArrowDownToLine className="icon-xs" />
      )}
    </button>
  );
}
