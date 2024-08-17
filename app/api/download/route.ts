import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { z } from "zod";

import { FluxHashids } from "@/db/dto/flux.dto";
import { prisma } from "@/db/prisma";
import { FluxTaskStatus } from "@/db/type";
import { getErrorMessage } from "@/lib/handle-error";
import { redis } from "@/lib/redis";

const searchParamsSchema = z.object({
  fluxId: z.string(),
});

const getMime = (filename: string) =>
  filename
    .substring(filename.lastIndexOf(".") + 1, filename.length)
    .toLowerCase();

export async function GET(req: NextRequest) {
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "5 s"),
    analytics: true,
  });
  const { success } = await ratelimit.limit(
    "download:image" + `_${req.ip ?? ""}`,
  );
  if (!success) {
    return new Response("Too Many Requests", {
      status: 429,
    });
  }

  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const values = searchParamsSchema.parse(
      Object.fromEntries(url.searchParams),
    );
    const { fluxId } = values;
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
    if (fluxData.taskStatus !== FluxTaskStatus.Succeeded) {
      return new Response("flux status error", {
        status: 400,
      });
    }
    await prisma.$transaction(async (tx) => {
      await tx.fluxData.update({
        where: {
          id: fluxData.id,
        },
        data: {
          downloadNum: {
            increment: 1,
          },
        },
      });
      await tx.fluxDownloads.create({
        data: {
          fluxId: fluxData.id,
          userId: user.id,
        },
      });
    });

    // headers.set('Content-Type', 'image/*');// 默认动作是下载
    // headers.set("content-Type", "text/plain"); // 默认动作是浏览器展示
    const blob = await fetch(fluxData.imageUrl!).then((response) =>
      response.blob(),
    );
    console.log("blob.type-->", blob.type);
    const headers = new Headers();
    headers.set("Content-Type", blob.type); // 设置为文件的MIME类型
    headers.set(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(fluxId + `.${getMime(fluxData.imageUrl!)}`)}"`,
    );
    return new NextResponse(blob, { status: 200, statusText: "OK", headers });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }
}
