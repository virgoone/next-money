import { db } from "@/db";
import { ChargeProductHashids } from "@/db/dto/charge-product.dto";
import { chargeProduct, type ChargeProductDto } from "@/db/schema";

export async function getChargeProduct() {
  const data = await db
    .select()
    .from(chargeProduct)
    .orderBy(chargeProduct.credit);

  return {
    data: data.map(
      ({ id, ...rest }) =>
        ({
          ...rest,
          id: ChargeProductHashids.encode(id),
        }) as ChargeProductDto,
    ),
  };
}
