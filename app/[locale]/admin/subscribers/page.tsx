import React from "react";

import { prisma } from "@/db/prisma";

import SubscribersCard from "./_mods/card";

export default async function AdminSubscribersPage() {
  const count = await prisma.$queryRaw`
    SELECT
      (SELECT COUNT(*) FROM subscribers WHERE subscribed_at::date = CURRENT_DATE) AS today_count,
      (SELECT COUNT(*) FROM subscribers WHERE EXTRACT(YEAR FROM subscribed_at) = EXTRACT(YEAR FROM CURRENT_DATE) AND EXTRACT(MONTH FROM subscribed_at) = EXTRACT(MONTH FROM CURRENT_DATE)) AS this_month_count,
      (SELECT COUNT(*) FROM subscribers WHERE subscribed_at IS NOT NULL) as total
  `;

  // const {
  //   rows: [count],
  // } = await db.execute<{
  //   total: number;
  //   today_count: number;
  //   this_month_count: number;
  // }>(
  //   sql`SELECT
  // (SELECT COUNT(*) FROM subscribers WHERE subscribed_at::date = CURRENT_DATE) AS today_count,
  // (SELECT COUNT(*) FROM subscribers WHERE EXTRACT(YEAR FROM subscribed_at) = EXTRACT(YEAR FROM CURRENT_DATE) AND EXTRACT(MONTH FROM subscribed_at) = EXTRACT(MONTH FROM CURRENT_DATE)) AS this_month_count,
  // (SELECT COUNT(*) FROM subscribers WHERE subscribed_at IS NOT NULL) as total`,
  // );
  const subs = await prisma.subscribers.findMany({
    where: {
      subscribedAt: {
        lte: new Date(),
      },
    },
    take: 30,
    orderBy: {
      subscribedAt: "desc",
    },
  });

  return <SubscribersCard count={count ?? {}} dataSource={subs} />;
}
