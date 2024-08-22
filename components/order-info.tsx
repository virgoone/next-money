"use client";

import React, { useState } from "react";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import qs from "query-string";

import { UserSubscriptionPlan } from "types";
import Loading from "@/components/loading";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderPhase } from "@/db/type";
import { cn, formatDate, formatPrice } from "@/lib/utils";

import { Badge } from "./ui/badge";

interface BillingInfoProps extends React.HTMLAttributes<HTMLFormElement> {
  userSubscriptionPlan?: UserSubscriptionPlan;
}

const OrderBadge = {
  [OrderPhase.Paid]: "default",
  [OrderPhase.Canceled]: "Secondary",
  [OrderPhase.Failed]: "destructive",
};
export function OrderInfo() {
  const { getToken } = useAuth();
  const t = useTranslations("Orders");
  const [pageParams, setPageParams] = useState({
    page: 1,
    pageSize: 12,
  });
  const [phase, setPhase] = useState<OrderPhase | "all">("all");
  const queryData = useQuery({
    queryKey: ["queryUserOrder", pageParams, phase],
    queryFn: async () => {
      const values = phase === "all" ? {} : { phase };
      const res = await fetch(
        `/api/order?${qs.stringify({
          ...pageParams,
          ...values,
        })}`,
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        },
      ).then((res) => res.json());

      return res.data ?? { total: 0 };
    },
  });

  const onChangePage = (page: number) => {
    setPageParams({ ...pageParams, page });
  };

  return (
    <main className="grid flex-1 items-start gap-4 py-4 sm:py-0 md:gap-8">
      <Tabs
        value={phase}
        onValueChange={(value) => setPhase(value as OrderPhase | "all")}
      >
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">{t("order.all")}</TabsTrigger>
            <TabsTrigger value={OrderPhase.Paid}>{t("order.paid")}</TabsTrigger>
            <TabsTrigger value={OrderPhase.Failed}>
              {t("order.failed")}
            </TabsTrigger>
            <TabsTrigger value={OrderPhase.Canceled} className="hidden sm:flex">
              {t("order.canceled")}
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>{t("title")}</CardTitle>
              <CardDescription>{t("description")}</CardDescription>
            </CardHeader>
            <CardContent>
              {queryData.isPending || queryData.isFetching ? (
                <div className="flex h-full min-h-96 w-full items-center justify-center">
                  <Loading />
                </div>
              ) : queryData.isError || queryData?.data?.data?.length <= 0 ? (
                <div className="flex min-h-96 items-center justify-center">
                  <EmptyPlaceholder>
                    <EmptyPlaceholder.Icon name="post" />
                    <EmptyPlaceholder.Title>
                      {t("empty.title")}
                    </EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                      {t("empty.description")}
                    </EmptyPlaceholder.Description>
                  </EmptyPlaceholder>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("table.customer")}</TableHead>
                      <TableHead>{t("table.status")}</TableHead>
                      <TableHead>
                        {t("table.amount")}
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        {t("table.credit")}
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        {t("table.channel")}
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        {t("table.createdAt")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {queryData.data?.data?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="font-medium">
                            {item.userInfo?.fullName}
                          </div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {item.userInfo?.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={OrderBadge[item.phase]}>
                            {item.phase}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatPrice(item.amount)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          +{item.credit}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.channel}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(item.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            {queryData.data?.total > 0 && (
              <CardFooter className="justify-between">
                <div className="shrink-0 text-xs text-muted-foreground">
                  {t("table.total")} <strong>{queryData.data?.total}</strong>
                  &nbsp; {t("table.records")}
                </div>
                <Pagination className="justify-end">
                  <PaginationContent>
                    {pageParams.page !== 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => onChangePage(pageParams.page - 1)}
                        />
                      </PaginationItem>
                    )}
                    {pageParams.page * pageParams.pageSize <
                      queryData.data?.total && (
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => onChangePage(pageParams.page + 1)}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            )}
          </Card>
        </div>
      </Tabs>
    </main>
  );
}
