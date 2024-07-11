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
  },
  client: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
    NEXT_PUBLIC_SANITY_USE_CDN: z.boolean(),
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
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    HASHID_SALT: process.env.HASHID_SALT,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    VERCEL_ENV: process.env.VERCEL_ENV,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_USE_CDN:
      process.env.NEXT_PUBLIC_SANITY_USE_CDN == "true",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_EMAIL_FROM: process.env.NEXT_PUBLIC_SITE_EMAIL_FROM,
    NEXT_PUBLIC_SITE_LINK_PREVIEW_ENABLED:
      process.env.NEXT_PUBLIC_SITE_LINK_PREVIEW_ENABLED == "true",
    LINK_PREVIEW_API_BASE_URL: process.env.LINK_PREVIEW_API_BASE_URL,
    SITE_NOTIFICATION_EMAIL_TO: process.env.SITE_NOTIFICATION_EMAIL_TO,

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
  },
});
