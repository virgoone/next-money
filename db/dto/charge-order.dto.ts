import { z } from 'zod'

import { Hashids } from '@/lib/hashid'

export const ChargeOrderHashids = Hashids('ChargeOrder', 12)
