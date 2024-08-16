"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { GiftCodeHashids } from "@/db/dto/giftcode.dto";
import { prisma } from "@/db/prisma";
import { getErrorMessage } from "@/lib/handle-error";

import type { CreateSchema, UpdateSchema } from "./validations";

export async function createAction(input: CreateSchema) {
  noStore();
  try {
    const { code, creditAmount } = input;

    await Promise.all([
      await prisma.giftCode.create({
        data: {
          code,
          creditAmount,
        },
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
    await prisma.giftCode.update({
      where: {
        id: id as number,
      },
      data: {
        code,
        creditAmount,
      },
    });

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
    await prisma.giftCode.delete({
      where: {
        id: id as number,
      },
    });

    revalidatePath("/");
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
