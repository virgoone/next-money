import * as z from 'zod'

export const CreateNewsletterSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
})
export type CreateSchema = z.infer<typeof CreateNewsletterSchema>
