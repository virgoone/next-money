import { LogSnag } from "@logsnag/next/server";
import { env } from "@/env.mjs";

export const logsnag = new LogSnag({
  token: env.LOG_SNAG_TOKEN,
  project: "moss"
});