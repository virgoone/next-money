import React from "react";
import { db } from "~/db";
import { CommentDto } from "~/db/dto/comment.dto";
import { comments } from "~/db/schema";
import { client } from "~/sanity/lib/client";
import { desc, inArray, sql } from "drizzle-orm";

import CommentCard from "./_mods/card";

export default async function AdminCommentsPage() {
  const {
    rows: [commentsCount],
  } = await db.execute<{
    today_count: number;
    this_week_count: number;
    this_month_count: number;
  }>(
    sql`SELECT 
    (SELECT COUNT(*) FROM comments WHERE created_at::date = CURRENT_DATE) AS today_count,
    (SELECT COUNT(*) FROM comments WHERE EXTRACT('YEAR' FROM created_at) = EXTRACT('YEAR' FROM CURRENT_DATE) AND EXTRACT('WEEK' FROM created_at) = EXTRACT('WEEK' FROM CURRENT_DATE)) AS this_week_count,
    (SELECT COUNT(*) FROM comments WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE) AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)) AS this_month_count`,
  );

  const latestComments = await db
    .select()
    .from(comments)
    .orderBy(desc(comments.createdAt))
    .limit(15);
  // get unique post IDs from comments
  const postIds = [...new Set(latestComments.map((comment) => comment.postId))];
  const posts = await client.fetch<
    { _id: string; title: string; slug: string }[]
  >(
    `*[_type == "post" && (_id in [${postIds
      .map((v) => `"${v}"`)
      .join(",")}])]{ _id, title, "slug":slug.current }`,
  );
  // define a map with key of post IDs to posts
  const postMap = new Map(posts.map((post) => [post._id, post]));

  return (
    <CommentCard
      commentsCount={commentsCount}
      postMap={postMap}
      dataSource={latestComments as unknown as CommentDto[]}
    />
  );
}
