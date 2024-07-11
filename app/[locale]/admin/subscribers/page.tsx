import React from 'react'

import { desc, lte, sql } from 'drizzle-orm'

import { db } from '~/db'
import { subscribers } from '~/db/schema'

import SubscribersCard from './_mods/card'

export default async function AdminSubscribersPage() {
  const [count] = await db.execute<{
    total: number
    today_count: number
    this_month_count: number
  }>(
    sql`SELECT
  (SELECT COUNT(*) FROM subscribers WHERE strftime('%Y-%m-%d', datetime(subscribed_at)) = strftime('%Y-%m-%d', 'now')) AS today_count,
  (SELECT COUNT(*) FROM subscribers WHERE strftime('%Y-%m', datetime(subscribed_at)) = strftime('%Y-%m', 'now')) AS this_month_count,
  (SELECT COUNT(*) FROM subscribers WHERE subscribed_at IS NOT NULL) AS total`,
  )
  const subs = await db
    .select()
    .from(subscribers)
    .where(lte(subscribers.subscribedAt, new Date()))
    .limit(30)
    .orderBy(desc(subscribers.subscribedAt))

  return <SubscribersCard count={count} dataSource={subs} />
}
