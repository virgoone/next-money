import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    DATABASE_URL: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    HASHID_SALT: z.string().min(1),
    VERCEL_ENV: z
      .enum(["development", "preview", "production"])
      .default("development"),
    UPSTASH_REDIS_REST_URL: z.string().min(1),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    LINK_PREVIEW_API_BASE_URL: z.string().optional(),
    SITE_NOTIFICATION_EMAIL_TO: z.string().optional(),

    S3_ENDPOINT: z.string().min(1),
    S3_REGION: z.string().min(1),
    S3_ACCESS_KEY: z.string().min(1),
    S3_SECRET_KEY: z.string().min(1),
    S3_URL_BASE: z.string().min(1),
    S3_BUCKET: z.string().min(1),

    STRIPE_API_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    WEBHOOK_SECRET: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    LOG_SNAG_TOKEN: z.string().min(1),
    TASK_HEADER_KEY: z.string().min(1),
    FLUX_HEADER_KEY: z.string().min(1),
    FLUX_CREATE_URL: z.string().min(1),
    APP_ENV: z
      .enum(["development", "production", "staging"])
      .default("development"),
    OPEN_AI_API_ENDPOINT: z.string().url(),
    OPEN_AI_API_KEY: z.string().min(1),
    FLUX_AI_PROMPT: z.string().min(1),
    OPEN_AI_MODEL: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().min(1),
    NEXT_PUBLIC_SITE_EMAIL_FROM: z.string().min(1),
    NEXT_PUBLIC_SITE_LINK_PREVIEW_ENABLED: z
      .boolean()
      .optional()
      .default(false),

    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),

    NEXT_PUBLIC_UMAMI_DATA_ID: z.string().optional(),
    NEXT_PUBLIC_GA_ID: z.string().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    HASHID_SALT: process.env.HASHID_SALT,
    LOG_SNAG_TOKEN: process.env.LOG_SNAG_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    VERCEL_ENV: process.env.VERCEL_ENV,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_EMAIL_FROM: process.env.NEXT_PUBLIC_SITE_EMAIL_FROM,
    NEXT_PUBLIC_SITE_LINK_PREVIEW_ENABLED:
      process.env.NEXT_PUBLIC_SITE_LINK_PREVIEW_ENABLED == "true",
    LINK_PREVIEW_API_BASE_URL: process.env.LINK_PREVIEW_API_BASE_URL,
    SITE_NOTIFICATION_EMAIL_TO: process.env.SITE_NOTIFICATION_EMAIL_TO,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_REGION: process.env.S3_REGION,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    S3_URL_BASE: process.env.S3_URL_BASE,
    S3_BUCKET: process.env.S3_BUCKET,

    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID:
      process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID:
      process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID:
      process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID:
      process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    TASK_HEADER_KEY: process.env.TASK_HEADER_KEY,
    FLUX_HEADER_KEY: process.env.FLUX_HEADER_KEY,
    FLUX_CREATE_URL: process.env.FLUX_CREATE_URL,
    APP_ENV: process.env.APP_ENV,

    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_UMAMI_DATA_ID: process.env.NEXT_PUBLIC_UMAMI_DATA_ID,

    OPEN_AI_API_ENDPOINT: process.env.OPEN_AI_API_ENDPOINT,
    OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
    FLUX_AI_PROMPT: process.env.FLUX_AI_PROMPT,
    OPEN_AI_MODEL: process.env.OPEN_AI_MODEL,
  },
});
