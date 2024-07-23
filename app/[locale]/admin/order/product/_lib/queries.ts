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

import { db } from "@/db";
import { ChargeProductHashids } from "@/db/dto/charge-product.dto";
import { chargeProduct, type ChargeProductDto } from "@/db/schema";
import { filterColumn } from "@/lib/filter-column";

import { type GetSchema } from "./validations";
import { DrizzleWhere } from "@/components/data-table/types";

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
    ]) as [keyof ChargeProductDto | undefined, "asc" | "desc" | undefined];

    // Convert the date strings to Date objects
    // Convert the date strings to date objects
    const fromDay = from ? sql`to_date(${from}, 'yyyy-mm-dd')` : undefined;
    const toDay = to ? sql`to_date(${to}, 'yyy-mm-dd')` : undefined;

    const where: DrizzleWhere<ChargeProductDto> =
      !operator || operator === "and"
        ? and(
            !!state
              ? filterColumn({
                  column: chargeProduct.state,
                  value: state + "",
                  isSelectable: true,
                })
              : undefined,
            // Filter by createdAt
            fromDay && toDay
              ? and(
                  gte(chargeProduct.createdAt, fromDay),
                  lte(chargeProduct.createdAt, toDay),
                )
              : undefined,
          )
        : or(
            !!state
              ? filterColumn({
                  column: chargeProduct.state,
                  value: state + "",
                  isSelectable: true,
                })
              : undefined,
            // Filter by createdAt
            fromDay && toDay
              ? and(
                  gte(chargeProduct.createdAt, fromDay),
                  lte(chargeProduct.createdAt, toDay),
                )
              : undefined,
          );

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(chargeProduct)
        .limit(pageSize)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in chargeProduct
            ? order === "asc"
              ? asc(chargeProduct[column])
              : desc(chargeProduct[column])
            : desc(chargeProduct.id),
        );
      const total = await tx
        .select({
          count: count(),
        })
        .from(chargeProduct)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0);
      return {
        data: data.map(({ id, ...rest }) => ({
          ...rest,
          id: ChargeProductHashids.encode(id),
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
