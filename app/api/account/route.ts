import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { AccountHashids } from "@/db/dto/account.dto";
import { userCoin } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { eq } from "drizzle-orm";

import { redis } from "@/lib/redis";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "5 s"),
    analytics: true,
  });
  const { success } = await ratelimit.limit(
    "account:info" + `_${req.ip ?? ""}`,
  );
  if (!success) {
    return new Response("Too Many Requests", {
      status: 429,
    });
  }

  let [accountInfo] = await db
    .select()
    .from(userCoin)
    .where(eq(userCoin.userId, user.id));
  if (!accountInfo?.id) {
    const data = await db
      .insert(userCoin)
      .values({
        userId: user.id,
        coin: 0,
        reward: 0,
      })
      .returning({
        id: userCoin.id,
        coin: userCoin.coin,
        reward: userCoin.reward,
        userId: userCoin.userId,
        createdAt: userCoin.createdAt,
        updatedAt: userCoin.updatedAt,
      });
    accountInfo = data as unknown as any;
  }

  return NextResponse.json({
    ...accountInfo,
    id: AccountHashids.encode(accountInfo.id),
  });
}
