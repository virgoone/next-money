import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { UserBillingHashids } from "@/db/dto/billing.dto";
import { FluxHashids } from "@/db/dto/flux.dto";
import { prisma } from "@/db/prisma";
import { getErrorMessage } from "@/lib/handle-error";

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),
  sort: z.string().optional(),
  type: z.string().optional(),
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
    const { page, pageSize, type } = values;
    const offset = (page - 1) * pageSize;
    const whereConditions: any = {
      userId,
    };
    if (type) {
      whereConditions.type = type;
    }

    const [data, total] = await Promise.all([
      prisma.userBilling.findMany({
        where: whereConditions,
        take: pageSize,
        skip: offset,
        orderBy: { createdAt: "desc" },
      }),
      prisma.userBilling.count({ where: whereConditions }),
    ]);

    return NextResponse.json({
      data: {
        total,
        page,
        pageSize,
        data: data.map(({ id, fluxId, ...rest }) => ({
          ...rest,
          fluxId: fluxId ? FluxHashids.encode(fluxId!) : null,
          id: UserBillingHashids.encode(id),
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
