import { eq } from "drizzle-orm";

import { db } from "@/db";
import { AccountHashids } from "@/db/dto/account.dto";
import { userCredit, type UserCreditDto } from "@/db/schema";

export async function getUserCredit(userId: string) {
  let [accountInfo] = await db
    .select()
    .from(userCredit)
    .where(eq(userCredit.userId, userId));
  if (!accountInfo?.id) {
    const data = await db
      .insert(userCredit)
      .values({
        userId: userId,
        credit: 0,
      })
      .returning({
        id: userCredit.id,
        credit: userCredit.credit,
        userId: userCredit.userId,
        createdAt: userCredit.createdAt,
        updatedAt: userCredit.updatedAt,
      });
    accountInfo = data as unknown as any;
  }
  return accountInfo as UserCreditDto;
}
