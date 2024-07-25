import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { AccountHashids } from "@/db/dto/account.dto";
import { userCredit } from "@/db/schema";
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
    .from(userCredit)
    .where(eq(userCredit.userId, user.id));
  if (!accountInfo?.id) {
    const data = await db
      .insert(userCredit)
      .values({
        userId: user.id,
        credit: 0,
      })
      .returning({
        id: userCredit.id,
        credit: userCredit.credit,
        userId: userCredit.userId,
        createdAt: userCredit.createdAt,
        updatedAt: userCredit.updatedAt,
      });
    accountInfo = data as unknown as any;
  }

  return NextResponse.json({
    ...accountInfo,
    id: AccountHashids.encode(accountInfo.id),
  });
}
