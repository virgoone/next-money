import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";
import { unstable_setRequestLocale } from "next-intl/server";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { UserNameForm } from "@/components/forms/user-name-form";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Settings – SaaS Starter",
  description: "Configure your account and website settings.",
});

type Props = {
  params: { locale: string };
};

export const runtime = "edge";

export default async function SettingsPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
        <UserNameForm user={{ id: user.id, name: user.fullName || "" }} />
      </div>
    </DashboardShell>
  );
}
