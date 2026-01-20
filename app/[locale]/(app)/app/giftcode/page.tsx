import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import GiftCodeForm from "@/components/forms/gift-code-form";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "GiftCode" });

  return {
    title: t("title"),
    description: t("text"),
  };
}


export default async function SettingsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await currentUser();

  if (!user) {
    redirect("/");
  }
  const t = await getTranslations({ locale, namespace: "GiftCode" });

  return (
    <DashboardShell>
      <DashboardHeader heading={t("title")} text={t("text")} />
      <div className="grid gap-10">
        <GiftCodeForm />
      </div>
    </DashboardShell>
  );
}
