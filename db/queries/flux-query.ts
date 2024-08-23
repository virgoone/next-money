import { FluxHashids } from "@/db/dto/flux.dto";
import { prisma } from "@/db/prisma";

import { FluxSelectDto } from "../type";

function snakeToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

// 转换整个对象的键为驼峰命名
function convertKeysToCamelCase(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = snakeToCamelCase(key);
      newObj[camelKey] = obj[key];
    }
  }
  return newObj;
}

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
  const transformedResults = data
    ? ((data as any[]).map(convertKeysToCamelCase) ?? [])
    : [];
  // const data = await db.execute(sql`SELECT * FROM face_data ORDER BY RANDOM() LIMIT 20;`);

  return {
    data: transformedResults?.map(({ id, imageUrl, ...rest }) => ({
      ...rest,
      imageUrl: `https://img.douni.one/?url=${encodeURIComponent(imageUrl!)}&action=resize!520,520,2|draw_text!s.douni.one/a,10,400`,
      id: FluxHashids.encode(id),
    })) as unknown as FluxSelectDto[],
  };
}