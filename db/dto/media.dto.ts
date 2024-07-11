import { z } from 'zod'

import { Hashids } from '~/lib/hashid'

export const MediaDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
  key: z.string(),
  color: z.string().optional(),
  blurhash: z.string().optional(),
  fileSize: z.number(),
  fileType: z.string(),
  md5: z.string(),
  ext: z.any().optional(),
  createdAt: z.date().or(z.string()),
})

export type MediaDto = z.infer<typeof MediaDtoSchema>

export const MediaHashids = Hashids('media')
