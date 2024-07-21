import BaseHashIds from "hashids";

import { env } from "@/env.mjs";

export const Hashids = (prefix: string, length = 16) => {
  return new BaseHashIds(`${env.HASHID_SALT}:${prefix}`, length);
};
