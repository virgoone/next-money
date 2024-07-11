import React from "react";
import { db } from "~/db";
import { subscribers } from "~/db/schema";
import { desc, lte, sql } from "drizzle-orm";

import SubscribersCard from "./_mods/card";

export default async function AdminSubscribersPage() {
  const {
    rows: [count],
  } = await db.execute<{
    total: number;
    today_count: number;
    this_month_count: number;
  }>(
    sql`SELECT
  (SELECT COUNT(*) FROM subscribers WHERE subscribed_at::date = CURRENT_DATE) AS today_count,
  (SELECT COUNT(*) FROM subscribers WHERE EXTRACT(YEAR FROM subscribed_at) = EXTRACT(YEAR FROM CURRENT_DATE) AND EXTRACT(MONTH FROM subscribed_at) = EXTRACT(MONTH FROM CURRENT_DATE)) AS this_month_count,
  (SELECT COUNT(*) FROM subscribers WHERE subscribed_at IS NOT NULL) as total`,
  );
  const subs = await db
    .select()
    .from(subscribers)
    .where(lte(subscribers.subscribedAt, new Date()))
    .limit(30)
    .orderBy(desc(subscribers.subscribedAt));

  return <SubscribersCard count={count} dataSource={subs} />;
}
