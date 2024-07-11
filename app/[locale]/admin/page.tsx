import React from 'react'

import { sql } from 'drizzle-orm'
import { motion } from 'framer-motion'

import StatisticsCard from '~/components/StatisticsCard'
import { db } from '~/db'

export default async function AdminPage() {
  const [count] = await db.all<{
    comments: number
    subscribers: number
    guestbook: number
  }>(
    sql`SELECT 
  (SELECT COUNT(*) FROM comments) as comments,
  (SELECT COUNT(*) FROM subscribers WHERE subscribed_at IS NOT NULL) as subscribers,
  (SELECT COUNT(*) FROM guestbook) as guestbook`,
  )
  return (
    <>
      <div className="flex flex-col">
        {/* <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="ml-auto flex items-center space-x-4">
            </div>
          </div>
        </div> */}
        <div className="flex-1 space-y-4 p-4">
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-3">
            {count && 'comments' in count && (
              <StatisticsCard title="总评论" count={count.comments} />
            )}
            {count && 'subscribers' in count && (
              <StatisticsCard title="总订阅" count={count.subscribers} />
            )}
            {count && 'guestbook' in count && (
              <StatisticsCard title="总留言" count={count.guestbook} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
