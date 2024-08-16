import { FluxHashids } from "@/db/dto/flux.dto";
import { prisma } from "@/db/prisma";

export async function getFluxDataBySeed({ limit = 18 }: { limit?: number }) {
  // const [count] = await db
  //   .select({
  //     count: sql<number>`count(${face.id})`,
  //   })
  //   .from(face)
  //   .execute();
  const data = await prisma.$queryRaw`
    SELECT * FROM flux_data
    ORDER BY RANDOM()
    LIMIT ${limit}
  `;
  // const data = await db.execute(sql`SELECT * FROM face_data ORDER BY RANDOM() LIMIT 20;`);

  return {
    data: ((data as any[]) ?? [])?.map(
      ({ id, imageUrl, ...rest }) =>
        ({
          ...rest,
          imageUrl: `https://img.douni.one/?url=${encodeURIComponent(imageUrl!)}&action=resize!520,520,2|draw_text!s.douni.one/a,10,400`,
          id: FluxHashids.encode(id),
        }),
    ),
  };
}
