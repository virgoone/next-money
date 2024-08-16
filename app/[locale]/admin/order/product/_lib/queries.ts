import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { ChargeProductHashids } from "@/db/dto/charge-product.dto";
import { prisma } from "@/db/prisma";
import { type ChargeProductDto } from "@/db/type";

import { type GetSchema } from "./validations";

export async function getBySearch(input: GetSchema) {
  noStore();
  const { page, pageSize, sort, state, from, to, operator } = input;

  try {
    const offset = (page - 1) * pageSize;
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof ChargeProductDto | undefined, "asc" | "desc" | undefined];

    const whereConditions: any = {};

    if (state) {
      whereConditions.state = state;
    }

    if (from && to) {
      whereConditions.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    const where =
      operator === "or"
        ? {
            OR: Object.entries(whereConditions).map(([key, value]) => ({
              [key]: value,
            })),
          }
        : whereConditions;

    const [data, total] = await Promise.all([
      prisma.chargeProduct.findMany({
        where,
        take: pageSize,
        skip: offset,
        orderBy: column ? { [column]: order ?? "desc" } : { id: "desc" },
      }),
      prisma.chargeProduct.count({ where }),
    ]);

    const pageCount = Math.ceil(total / pageSize);

    return {
      data: data.map(({ id, ...rest }) => ({
        ...rest,
        id: ChargeProductHashids.encode(id), // Assuming you want to convert id to string
      })),
      pageCount,
      total,
    };
  } catch (err) {
    console.error("Error in getBySearch:", err);
    return { data: [], pageCount: 0, total: 0, pageSize, page };
  }
}
