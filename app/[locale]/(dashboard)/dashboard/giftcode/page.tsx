import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import GiftCodeForm from "@/components/forms/gift-code-form";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Settings – SaaS Starter",
  description: "Configure your account and website settings.",
});

type Props = {
  params: { locale: string };
};



export default async function SettingsPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  const user = await currentUser();

  if (!user) {
    redirect("/");
  }
  const t = await getTranslations({ namespace: "GiftCode" });

  return (
    <DashboardShell>
      <DashboardHeader heading={t("title")} text={t("text")} />
      <div className="grid gap-10">
        <GiftCodeForm />
      </div>
    </DashboardShell>
  );
}
