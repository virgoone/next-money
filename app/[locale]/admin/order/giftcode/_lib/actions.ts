"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { GiftCodeHashids } from "@/db/dto/giftcode.dto";
import { giftCode } from "@/db/schema";
import { getErrorMessage } from "@/lib/handle-error";

import type { CreateSchema, UpdateSchema } from "./validations";

export async function createAction(input: CreateSchema) {
  noStore();
  try {
    const { code, creditAmount } = input;

    await Promise.all([
      await db
        .insert(giftCode)
        .values({
          code,
          creditAmount,
        })
        .returning({
          newId: giftCode.id,
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
    const [id] = GiftCodeHashids.decode(input.id);
    const { code, creditAmount } = input;
    await db
      .update(giftCode)
      .set({
        code,
        creditAmount,
      })
      .where(eq(giftCode.id, id as number));

    revalidatePath("/");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    console.log("err--->", err);
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteAction(input: { id: string }) {
  try {
    const [id] = GiftCodeHashids.decode(input.id);
    await db.delete(giftCode).where(eq(giftCode.id, id as number));

    revalidatePath("/");
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
