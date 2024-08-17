import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function ChartsLoading() {
  return (
    <>
      <DashboardHeader heading="Charts" />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
