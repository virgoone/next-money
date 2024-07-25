"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";
import { omitBy } from "lodash-es";

import { db } from "@/db";
import { ChargeProductHashids } from "@/db/dto/charge-product.dto";
import { chargeProduct, type ChargeProductDto } from "@/db/schema";
import { getErrorMessage } from "@/lib/handle-error";

import type { CreateSchema, UpdateSchema } from "./validations";

export async function createAction(input: CreateSchema) {
  noStore();
  try {
    const { credit, amount, currency, tag, originalAmount, message, state } =
      input;

    await Promise.all([
      await db
        .insert(chargeProduct)
        .values({
          credit,
          amount,
          currency,
          originalAmount,
          tag,
          message,
          state,
        })
        .returning({
          newId: chargeProduct.id,
        }),
    ]);

    revalidatePath("/");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function updateAction(input: UpdateSchema & { id: string }) {
  noStore();
  try {
    const [id] = ChargeProductHashids.decode(input.id);
    await db
      .update(chargeProduct)
      .set(omitBy(input, (v) => !v))
      .where(eq(chargeProduct.id, id as number));

    revalidatePath("/");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteAction(input: { id: string }) {
  try {
    const [id] = ChargeProductHashids.decode(input.id);
    await db.delete(chargeProduct).where(eq(chargeProduct.id, id as number));

    revalidatePath("/");
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
