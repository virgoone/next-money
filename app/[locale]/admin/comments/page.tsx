import React from 'react'

import { desc, inArray, sql } from 'drizzle-orm'

import { db } from '~/db'
import { CommentDto } from '~/db/dto/comment.dto'
import { comments, post } from '~/db/schema'
import { client } from '~/sanity/lib/client'

import CommentCard from './_mods/card'

export default async function AdminCommentsPage() {
  const [commentsCount] = await db.all<{
    today_count: number
    total_count: number
    this_month_count: number
  }>(
    sql`SELECT 
  (SELECT COUNT(*) FROM comments WHERE strftime('%Y-%m-%d', created_at) = strftime('%Y-%m-%d', 'now')) AS today_count,
  (SELECT COUNT(*) FROM comments) AS total_count,
  (SELECT COUNT(*) FROM comments WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')) AS this_month_count`,
  )

  const latestComments = await db
    .select()
    .from(comments)
    .orderBy(desc(comments.createdAt))
    .limit(15)
  // get unique post IDs from comments
  const postIds = [...new Set(latestComments.map((comment) => comment.postId))]
  const posts = await client.fetch<
    { _id: string; title: string; slug: string }[]
  >(
    `*[_type == "post" && (_id in [${postIds
      .map((v) => `"${v}"`)
      .join(',')}])]{ _id, title, "slug":slug.current }`,
  )
  // define a map with key of post IDs to posts
  const postMap = new Map(posts.map((post) => [post._id, post]))

  return (
    <CommentCard
      commentsCount={commentsCount}
      postMap={postMap}
      dataSource={latestComments as unknown as CommentDto[]}
    />
  )
}
