import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  or,
  sql,
  type SQL,
} from "drizzle-orm";

import { DrizzleWhere } from "@/components/data-table/types";
import { db } from "@/db";
import { GiftCodeHashids } from "@/db/dto/giftcode.dto";
import { giftCode, type GiftCodeDto } from "@/db/schema";
import { filterColumn } from "@/lib/filter-column";

import { type GetSchema } from "./validations";

export async function getBySearch(input: GetSchema) {
  noStore();
  const { page, pageSize, sort, state, from, to, operator } = input;

  try {
    // Offset to paginate the results
    const offset = (page - 1) * pageSize;
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof GiftCodeDto | undefined, "asc" | "desc" | undefined];

    // Convert the date strings to Date objects
    // Convert the date strings to date objects
    const fromDay = from ? sql`to_date(${from}, 'yyyy-mm-dd')` : undefined;
    const toDay = to ? sql`to_date(${to}, 'yyy-mm-dd')` : undefined;

    const where: DrizzleWhere<GiftCodeDto> =
      !operator || operator === "and"
        ? and(
            // Filter by createdAt
            fromDay && toDay
              ? and(
                  gte(giftCode.createdAt, fromDay),
                  lte(giftCode.createdAt, toDay),
                )
              : undefined,
          )
        : or(
            // Filter by createdAt
            fromDay && toDay
              ? and(
                  gte(giftCode.createdAt, fromDay),
                  lte(giftCode.createdAt, toDay),
                )
              : undefined,
          );

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(giftCode)
        .limit(pageSize)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in giftCode
            ? order === "asc"
              ? asc(giftCode[column])
              : desc(giftCode[column])
            : desc(giftCode.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(giftCode)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0);
      return {
        data: data.map(({ id, ...rest }) => ({
          ...rest,
          id: GiftCodeHashids.encode(id),
        })),
        total,
      };
    });
    const pageCount = Math.ceil(total / pageSize);
    return { data, pageCount, total };
  } catch (err) {
    return { data: [], pageCount: 0, total: 0, pageSize, page };
  }
}
