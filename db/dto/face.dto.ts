import { z } from 'zod'

import { Hashids } from '@/lib/hashid'

export const FaceDtoSchema = z.object({
  id: z.string(),
  url: z.string(),
  age: z.number(),
  dominantEmotion: z.string(),
  dominantGender: z.string(),
  dominantRace: z.string(),
  downloads: z.number(),
  views: z.number(),
  deepFace: z.any(),
  createdAt: z.date().or(z.string()),
})
export type FaceDto = z.infer<typeof FaceDtoSchema>
export const FaceHashids = Hashids('face_data')
