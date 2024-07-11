import { db } from "~/db";
import { newsletters } from "~/db/schema";
import { desc, sql } from "drizzle-orm";

import NewsLatterCard from "./_mods/card";

export default async function AdminNewslettersPage() {
  const {
    rows: [count],
  } = await db.execute<{
    total: number;
    today_count: number;
    this_month_count: number;
  }>(
    sql`SELECT 
    (SELECT COUNT(*) FROM newsletters WHERE sent_at::date = CURRENT_DATE) AS today_count,
    (SELECT COUNT(*) FROM newsletters WHERE EXTRACT(YEAR FROM sent_at) = EXTRACT(YEAR FROM CURRENT_DATE) AND EXTRACT(MONTH FROM sent_at) = EXTRACT(MONTH FROM CURRENT_DATE)) AS this_month_count,
    (SELECT COUNT(*) FROM newsletters) as total`,
  );
  const nl = await db
    .select()
    .from(newsletters)
    .limit(100)
    .orderBy(desc(newsletters.sentAt));

  return <NewsLatterCard count={count} dataSource={nl} />;
}
