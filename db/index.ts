import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { env } from "@/env.mjs";

const connectionString = env.DATABASE_URL!;

neonConfig.pipelineConnect = false;

const pool = new Pool({ connectionString });
export const db = drizzle(pool, { logger: true });
