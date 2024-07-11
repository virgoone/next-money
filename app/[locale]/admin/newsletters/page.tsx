import { desc, sql } from 'drizzle-orm'

import { db } from '~/db'
import { newsletters } from '~/db/schema'

import NewsLatterCard from './_mods/card'

export default async function AdminNewslettersPage() {
  const [count] = await db.all<{
    total: number
    today_count: number
    this_month_count: number
  }>(
    sql`SELECT 
    (SELECT COUNT(*) FROM newsletters WHERE sent_at = CURRENT_DATE) AS today_count,
    (SELECT COUNT(*) FROM newsletters WHERE strftime('%Y', sent_at) = strftime('%Y', 'now') AND strftime('%m', sent_at) = strftime('%m', 'now')) AS this_month_count,
    (SELECT COUNT(*) FROM newsletters WHERE sent_at IS NOT NULL) as total`,
  )
  const nl = await db
    .select()
    .from(newsletters)
    .limit(100)
    .orderBy(desc(newsletters.sentAt))

  return <NewsLatterCard count={count} dataSource={nl} />
}
