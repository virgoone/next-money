import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";
import { unstable_setRequestLocale } from "next-intl/server";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { Button } from "@/components/ui/button";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Settings – SaaS Starter",
  description: "Overview of your account and activities.",
});

type Props = {
  params: { locale: string };
};


export default async function DashboardPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Panel" text="Create and manage content." />
      <div>
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title>No content created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any content yet. Start creating content.
          </EmptyPlaceholder.Description>
          <Button variant="outline">Fake button</Button>
        </EmptyPlaceholder>
      </div>
    </DashboardShell>
  );
}
