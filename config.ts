import { LocalePrefix, Pathnames } from "next-intl/routing";

export const defaultLocale = "en" as const;
export const locales = ["en", "zh", "tw", "fr", "ja"] as const;

export type Locale = (typeof locales)[number];

export const pathnames: Pathnames<typeof locales> = {
  "/": "/",
};

export const localePrefix: LocalePrefix<typeof locales> = "as-needed";

export const port = process.env.PORT || 3000;
export const host = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${port}`;
