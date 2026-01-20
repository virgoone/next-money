import { Pathnames } from "next-intl/routing";

// Re-export from centralized routing config
export { defaultLocale, locales, routing, type Locale } from "./i18n/routing";

export const pathnames: Pathnames<
  ["en", "zh", "tw", "fr", "ja", "ko", "de", "pt", "es", "ar"]
> = {
  "/": "/",
  "/blog": "/blog",
  "/flux-schnell": "/flux-schnell",
  "/flux-prompt-generator": "/flux-prompt-generator",
};

export const localePrefix = "as-needed" as const;

export const port = process.env.PORT || 3000;
export const host = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${port}`;
