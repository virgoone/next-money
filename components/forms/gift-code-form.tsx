"use client";

import { useState } from "react";

import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useReward } from "react-rewards";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const useGiftCodeMutation = (config?: { onSuccess: (result: any) => void }) => {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (values: any) => {
      const res = await fetch("/api/gift-code", {
        body: JSON.stringify(values),
        method: "POST",
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (!res.ok) {
        throw new Error("Network response error");
      }

      return res.json();
    },
    onSuccess: async (result) => {
      config?.onSuccess(result);
    },
  });
};
export default function CardRedemption() {
  const t = useTranslations("GiftCode");
  const profileFormSchema = z.object({
    giftCode: z
      .string({
        required_error: t("form.required"),
      })
      .min(8, {
        message: t("form.invalid"),
      }),
  });
  type ProfileFormValues = z.infer<typeof profileFormSchema>;
  const { reward } = useReward("gift-code-paid-success", "confetti", {
    position: "fixed",
    elementCount: 360,
    spread: 80,
    elementSize: 8,
    lifetime: 400,
  });
  const useGiftCode = useGiftCodeMutation();
  const [saving, setSaving] = useState(false);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      giftCode: "",
    } as ProfileFormValues,
    mode: "onChange",
  });
  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      const res = await useGiftCode.mutateAsync({ code: data.giftCode });
      if (!res.error) {
        toast.success(t("form.success", {
          credits: res.creditAmount,
        }));
        setTimeout(() => {
          reward();
        }, 1000);
        form.reset({
          giftCode: "",
        });
        // navigate("/app/billings/recharge");
      } else {
        toast.error(res.error || t("form.error"));
      }
    } catch (error) {
      toast.error(t("form.error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[520px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="giftCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-label={t("form.aria_label")}>
                  {t("form.aria_label")}
                </FormLabel>
                <FormControl>
                  <Input placeholder={t("form.placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button id="gift-code-paid-success" type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("form.button")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
