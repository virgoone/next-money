import { ChargeProductHashids } from "@/db/dto/charge-product.dto";
import { prisma } from "@/db/prisma";

export async function getChargeProduct() {
  const data = await prisma.chargeOrder.findMany({
    orderBy: {
      credit: "asc",
    },
  });

  return {
    data: data.map(({ id, ...rest }) => ({
      ...rest,
      id: ChargeProductHashids.encode(id),
    })),
  };
}
