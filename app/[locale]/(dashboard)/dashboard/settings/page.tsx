import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { unstable_setRequestLocale } from "next-intl/server";

import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { UserNameForm } from "@/components/forms/user-name-form";

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
    redirect("/login");
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
