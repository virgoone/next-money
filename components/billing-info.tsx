"use client";

import React, { useState } from "react";
import Link from "next/link";

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
import { OrderPhase } from "@/db/type";
import { cn, formatDate, formatPrice } from "@/lib/utils";

import { Badge } from "./ui/badge";

interface BillingInfoProps extends React.HTMLAttributes<HTMLFormElement> {
  userSubscriptionPlan?: UserSubscriptionPlan;
}

const OrderBadge = {
  Done: "default",
  Pending: "Secondary",
};
export default function BillingInfo() {
  const { getToken } = useAuth();
  const t = useTranslations("Billings");
  const [pageParams, setPageParams] = useState({
    page: 1,
    pageSize: 10,
  });
  const [phase, setPhase] = useState<OrderPhase | "all">("all");
  const queryData = useQuery({
    queryKey: ["queryUserBilling", pageParams],
    queryFn: async () => {
      const res = await fetch(
        `/api/billings?${qs.stringify({
          ...pageParams,
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
      <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
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
                    <TableHead>{t("table.fluxId")}</TableHead>
                    <TableHead className="hidden md:table-cell">
                      {t("table.amount")}
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      {t("table.type")}
                    </TableHead>
                    <TableHead>{t("table.status")}</TableHead>
                    <TableHead className="hidden md:table-cell">
                      {t("table.createdAt")}
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {queryData.data?.data?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.fluxId}
                      </TableCell>
                      <TableCell>
                        {item.amount} {t("table.amount")}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {item.type}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={OrderBadge[item.state]}>
                          {item.state}
                        </Badge>
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
            <CardFooter className="justify-end">
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
    </main>
  );
}
