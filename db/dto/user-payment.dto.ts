import { z } from 'zod'

import { Hashids } from '~/lib/hashid'

export const UserPaymentInfoDtoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userInfo: z.any(),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  stripePriceId: z.string().optional(),
  stripeCurrentPeriodEnd: z.date().optional(),
  createdAt: z.date().or(z.string()),
})

export type UserPaymentInfoDto = z.infer<typeof UserPaymentInfoDtoSchema>

export const UserPaymentInfoHashids = Hashids('UserPaymentInfo')
