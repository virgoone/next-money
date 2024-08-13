import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { FluxHashids } from "@/db/dto/flux.dto";
import { flux, type FluxDto } from "@/db/schema";

export async function getFluxDataBySeed({
  limit = 18,
  dominantEmotion,
  dominantGender,
}: {
  limit?: number;
  dominantEmotion?: string;
  dominantGender?: string;
}) {
  // const [count] = await db
  //   .select({
  //     count: sql<number>`count(${face.id})`,
  //   })
  //   .from(face)
  //   .execute();
  const data = await db
    .select()
    .from(flux)
    // .where(
    //   and(
    //     dominantEmotion ? eq(face.dominantEmotion, dominantEmotion) : undefined,
    //     dominantGender ? eq(face.dominantGender, dominantGender) : undefined,
    //   ),
    // )
    .orderBy(sql`RANDOM()`)
    .limit(limit);
  // const data = await db.execute(sql`SELECT * FROM face_data ORDER BY RANDOM() LIMIT 20;`);

  return {
    data: data.map(
      ({ id, imageUrl, ...rest }) =>
        ({
          ...rest,
          imageUrl: `https://img.douni.one/?url=${encodeURIComponent(url)}&action=resize!520,520,2|draw_text!s.douni.one/a,10,400`,
          id: FluxHashids.encode(id),
        }) as FluxDto,
    ),
  };
}
