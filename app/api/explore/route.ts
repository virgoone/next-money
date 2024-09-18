import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { model } from "@/config/constants";
import { FluxHashids } from "@/db/dto/flux.dto";
import { prisma } from "@/db/prisma";
import { FluxTaskStatus } from "@/db/type";
import { getErrorMessage } from "@/lib/handle-error";
import { Prisma } from "@prisma/client";

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),
  sort: z.string().optional(),
  model: z.enum([model.dev, model.pro, model.schnell]).optional(),
});

export async function GET(req: NextRequest) {

  try {
    const url = new URL(req.url);
    const values = searchParamsSchema.parse(
      Object.fromEntries(url.searchParams),
    );
    const { page, pageSize, model } = values;
    const offset = (page - 1) * pageSize;
    const whereConditions: Prisma.FluxDataWhereInput = {
      isPrivate: false,
      taskStatus: {
        in: [FluxTaskStatus.Succeeded],
      },
    };
    if (model) {
      whereConditions.model = model;
    }

    const [fluxData, total] = await Promise.all([
      prisma.fluxData.findMany({
        where: whereConditions,
        take: pageSize,
        skip: offset,
        orderBy: { createdAt: "desc" },
      }),
      prisma.fluxData.count({ where: whereConditions }),
    ]);

    return NextResponse.json({
      data: {
        total,
        page,
        pageSize,
        data: fluxData.map(
          ({ id, executeEndTime, executeStartTime, loraUrl, ...rest }) => ({
            ...rest,
            executeTime:
              executeEndTime && executeStartTime
                ? Number(`${executeEndTime - executeStartTime}`)
                : 0,
            id: FluxHashids.encode(id),
          }),
        ),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }
}
