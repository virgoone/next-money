"use client";

import React from "react";

import copy from "copy-to-clipboard";
import { debounce } from "lodash-es";
import { Copy, Eraser } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useGenerator } from "@/hooks/use-genrator";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { Icons } from "../shared/icons";
import SignBox from "../sign-box";

export default function Generator() {
  const {
    inputPrompt,
    setInputPrompt,
    generatedPrompt,
    loading,
    handleGenerate,
  } = useGenerator();

  const t = useTranslations("PromptGenerator");

  const copyPrompt = (prompt: string) => {
    copy(prompt);
    toast.success(t("form.action.copySuccess"));
  };

  const debounceHandleGenerate = debounce(handleGenerate, 800);

  const handleNavigate = () => {
    copy(generatedPrompt);
    window.sessionStorage.setItem("GENERATOR_PROMPT", generatedPrompt);
  };

  return (
    <div className="mt-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t("form.input.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Textarea
              id="userInput"
              placeholder={t("form.input.placeholder")}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <SignBox>
            <Button
              onClick={debounceHandleGenerate}
              disabled={loading || !inputPrompt.length}
              className="w-full"
            >
              {loading ? (
                <>
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                  {t("form.action.generating")}
                </>
              ) : (
                <>{t("form.action.generate")}</>
              )}
            </Button>
          </SignBox>
        </CardFooter>
      </Card>
      {generatedPrompt && (
        <Card>
          <CardHeader>
            <CardTitle>{t("form.output.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[100px] rounded-md bg-muted p-4">
              {generatedPrompt}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col justify-between gap-2 md:flex-row">
            <button
              className={cn(
                buttonVariants({ size: "sm" }),
                "focus-ring text-content-strong border-stroke-strong hover:border-stroke-stronger data-[state=open]:bg-surface-alpha-light inline-flex items-center justify-center whitespace-nowrap rounded-lg border bg-transparent from-white px-2.5 text-sm font-medium text-slate-900 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-50 dark:to-slate-900/10 dark:text-white hover:dark:text-slate-900",
              )}
              onClick={() => copyPrompt(generatedPrompt!)}
            >
              <Copy className="icon-xs me-1" />
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight">
                {t("form.action.copy")}
              </span>
            </button>
            <Link
              className={cn(
                buttonVariants({ size: "sm" }),
                "group relative w-full max-w-52 items-center justify-center gap-2 overflow-hidden whitespace-pre rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-all duration-300 ease-out hover:bg-primary/90 hover:ring-2 hover:ring-primary hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 md:flex",
              )}
              onClick={handleNavigate}
              href="/app/generate"
            >
              <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40" />
              <div className="flex items-center">
                <Eraser className="mr-2 size-4" />
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 dark:text-slate-900">
                  {t("form.action.to_generate")}
                </span>
              </div>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
