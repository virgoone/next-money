import { db } from "@/db";
import { FaceHashids, type FaceDto } from "@/db/dto/face.dto";
import { face } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function getFaceDataBySeed({
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
    .select({
      id: face.id,
      url: face.url,
      views: face.views,
      age: face.age,
      downloads: face.downloads,
      dominantEmotion: face.dominantEmotion,
      dominantGender: face.dominantGender,
      dominantRace: face.dominantRace,
      createdAt: face.createdAt,
      // deepFace: face.deepFace,
    })
    .from(face)
    .where(
      and(
        dominantEmotion ? eq(face.dominantEmotion, dominantEmotion) : undefined,
        dominantGender ? eq(face.dominantGender, dominantGender) : undefined,
      ),
    )
    .orderBy(sql`RANDOM()`)
    .limit(limit);
  // const data = await db.execute(sql`SELECT * FROM face_data ORDER BY RANDOM() LIMIT 20;`);

  return {
    data: data.map(
      ({ id, url, ...rest }) =>
        ({
          ...rest,
          url: `https://img.douni.one/?url=${encodeURIComponent(url)}&action=resize!520,520,2|draw_text!s.douni.one/a,10,400`,
          id: FaceHashids.encode(id),
        }) as FaceDto,
    ),
  };
}
