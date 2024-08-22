import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { z } from "zod";

import { FluxHashids } from "@/db/dto/flux.dto";
import { prisma } from "@/db/prisma";
import { getErrorMessage } from "@/lib/handle-error";
import { redis } from "@/lib/redis";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "5 s"),
});

function getKey(id: string) {
  return `task:query:${id}`;
}

const QueryTaskSchema = z.object({
  fluxId: z.string(),
});

export async function POST(req: NextRequest) {
  const { userId } = auth();

  const user = await currentUser();
  if (!userId || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { success } = await ratelimit.limit(
    getKey(userId) + `_${req.ip ?? ""}`,
  );
  if (!success) {
    return new Response("Too Many Requests", {
      status: 429,
    });
  }
  try {
    const data = await req.json();
    const { fluxId } = QueryTaskSchema.parse(data);
    const [id] = FluxHashids.decode(fluxId);
    if (!id) {
      return new Response("not found", {
        status: 404,
      });
    }
    const fluxData = await prisma.fluxData.findUnique({
      where: {
        id: id as number,
      },
    });

    if (!fluxData || !fluxData?.id) {
      return new Response("not found", {
        status: 404,
      });
    }
    const { executeEndTime, executeStartTime, loraUrl, ...rest } = fluxData;
    return NextResponse.json({
      data: {
        ...rest,
        executeTime:
          executeEndTime && executeStartTime
            ? `${executeEndTime - executeStartTime}`
            : 0,
        id: FluxHashids.encode(fluxData.id),
      },
    });
  } catch (error) {
    console.log("error-->", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }
}
