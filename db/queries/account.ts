import { prisma } from "@/db/prisma";

export async function getUserCredit(userId: string) {
  let accountInfo = await prisma.userCredit.findFirst({
    where: {
      userId,
    },
  });
  if (!accountInfo?.id) {
    const data = await prisma.userCredit.create({
      data: {
        userId: userId,
        credit: 0,
      },
    });
    accountInfo = data;
  }
  return accountInfo;
}
