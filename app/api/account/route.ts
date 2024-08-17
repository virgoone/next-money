import { NextResponse, type NextRequest } from "next/server";

import { currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";

import { AccountHashids } from "@/db/dto/account.dto";
import { getUserCredit } from "@/db/queries/account";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest) {
  console.time("stat");
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  // console.timeLog("stat");

  // const ratelimit = new Ratelimit({
  //   redis,
  //   limiter: Ratelimit.slidingWindow(5, "5 s"),
  //   analytics: true,
  // });
  // const { success } = await ratelimit.limit(
  //   "account:info" + `_${req.ip ?? ""}`,
  // );
  console.timeLog("stat");

  // if (!success) {
  //   return new Response("Too Many Requests", {
  //     status: 429,
  //   });
  // }

  const accountInfo = await getUserCredit(user.id);
  console.timeEnd("stat");

  return NextResponse.json({
    ...accountInfo,
    id: AccountHashids.encode(accountInfo.id),
  });
}
