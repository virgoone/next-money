import { NextResponse, type NextRequest } from "next/server";

import { Ratelimit } from "@upstash/ratelimit";
import { z } from "zod";

import { MediaDto, MediaHashids } from "@/db/dto/media.dto";
import { prisma } from "@/db/prisma";
import { env } from "@/env.mjs";
import { getErrorMessage } from "@/lib/handle-error";
import { redis } from "@/lib/redis";
import { S3Service } from "@/lib/s3";

function getKey(id: string) {
  return `media:${id}`;
}

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  analytics: true,
});

const getSchema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),
  name: z.string().nullish().optional(),
});

const deleteSchema = z.object({
  id: z.string(),
});

type GetSchema = z.infer<typeof getSchema>;

export async function GET(req: NextRequest) {
  try {
    const start = Date.now();
    const { success } = await ratelimit.limit(
      getKey(req.ip!) + `_${req.ip ?? ""}`,
    );
    if (!success) {
      return new Response("Too Many Requests", {
        status: 429,
      });
    }
    const a1 = Date.now();
    const { searchParams } = new URL(req.url);

    const {
      page,
      pageSize = 12,
      name,
    } = getSchema.parse({
      name: searchParams.get("name"),
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
    });

    const offset = (page - 1) * pageSize;
    const data = await prisma.media.findMany({
      where: {
        name: name
          ? {
              contains: name,
            }
          : undefined,
      },
      orderBy: {
        id: "desc",
      },
      skip: offset,
      take: pageSize,
    });
    return NextResponse.json({
      list: data.map(
        ({ id, ...rest }) =>
          ({
            ...rest,
            id: MediaHashids.encode(id),
          }) as MediaDto,
      ),
      pageSize,
      page,
    });
  } catch (error) {
    const err = getErrorMessage(error);
    return NextResponse.json({ error: err }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { success } = await ratelimit.limit(
      getKey(req.ip!) + `_${req.ip ?? ""}`,
    );
    if (!success) {
      return new Response("Too Many Requests", {
        status: 429,
      });
    }
    const body = await req.json();

    const { id } = deleteSchema.parse(body);
    const [mediaId] = MediaHashids.decode(id);
    const data = await prisma.media.findFirst({
      where: {
        id: mediaId as number,
      },
    });

    if (!data) {
      return NextResponse.json({
        error: "Media not found",
      });
    }
    const s3 = new S3Service({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
      url: env.S3_URL_BASE,
      bucket: env.S3_BUCKET,
    });
    try {
      await s3.deleteItemInBucket(data.key);
    } catch (error) {
      console.log("删除失败-->", error);
    }
    await prisma.media.delete({
      where: {
        id: mediaId as number,
      },
    });
    return NextResponse.json({
      id,
    });
  } catch (error) {
    console.log("error-->", error);
    const err = getErrorMessage(error);
    return NextResponse.json({ error: err }, { status: 400 });
  }
}
