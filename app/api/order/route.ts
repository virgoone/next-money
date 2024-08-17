import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { ChargeOrderHashids } from "@/db/dto/charge-order.dto";
import { prisma } from "@/db/prisma";
import { OrderPhase } from "@/db/type";
import { getErrorMessage } from "@/lib/handle-error";

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),
  sort: z.string().optional(),
  phase: z
    .enum([OrderPhase.Paid, OrderPhase.Canceled, OrderPhase.Failed])
    .optional(),
});

export async function GET(req: NextRequest) {
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
    const { page, pageSize, phase } = values;
    const offset = (page - 1) * pageSize;
    const whereConditions: any = {
      userId,
    };
    if (phase) {
      whereConditions.phase = phase;
    } else {
      whereConditions.phase = {
        not: OrderPhase.Pending,
      };
    }

    const [data, total] = await Promise.all([
      prisma.chargeOrder.findMany({
        where: whereConditions,
        take: pageSize,
        skip: offset,
        orderBy: { createdAt: "desc" },
      }),
      prisma.chargeOrder.count({ where: whereConditions }),
    ]);

    return NextResponse.json({
      data: {
        total,
        page,
        pageSize,
        data: data.map(({ id, ...rest }) => ({
          ...rest,
          id: ChargeOrderHashids.encode(id),
        })),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }
}
