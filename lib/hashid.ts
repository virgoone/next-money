import BaseHashIds from 'hashids'

import { env } from '~/env.mjs'

export const Hashids = (prefix: string) => {
  return new BaseHashIds(`${env.HASHID_SALT}:${prefix}`, 7)
}
