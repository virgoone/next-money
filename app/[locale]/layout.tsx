import "@/styles/globals.css";
// import "../clerk.css";
import "../prism.css";

import Script from "next/script";

import {
  deDE,
  enUS,
  esES,
  frFR,
  jaJP,
  koKR,
  ptPT,
  zhCN,
  zhTW,
  arSA,
} from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { GoogleAnalytics } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  unstable_setRequestLocale,
} from "next-intl/server";
import { ThemeProvider } from "next-themes";

import { fontHeading, fontSans, fontUrban } from "@/assets/fonts";
import { Analytics } from "@/components/analytics";
import ClaritySnippet from "@/components/ClaritySnippet";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/toaster";
import { locales } from "@/config";
import { siteConfig } from "@/config/site";
import { env } from "@/env.mjs";
import { cn } from "@/lib/utils";

import { QueryProvider } from "../QueryProvider";

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: Omit<RootLayoutProps, "children">) {
  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return {
    title: t("title"),
    metadataBase: siteConfig.url,
    alternates: {
      canonical: `/${locale === "en" ? "" : locale}`,
      languages: {
        "x-default": "/",
        zh: "/zh",
        tw: "/tw",
        ja: "/ja",
        fr: "/fr",
        es: "/es",
        de: "/de",
        ko: "/ko",
        pt: "/pt",
        ar: "/ar"
      },
    },
    openGraph: {
      images: siteConfig.ogImage,
    },
    description: t("description"),
    keywords: t("keywords"),
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const localeMap = {
  en: enUS,
  zh: zhCN,
  tw: zhTW,
  ja: jaJP,
  ko: koKR,
  fr: frFR,
  es: esES,
  de: deDE,
  pt: ptPT,
  ar: arSA,
};

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  unstable_setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <ClerkProvider localization={localeMap[locale] ?? enUS}>
      <html lang={locale} suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
            fontUrban.variable,
            fontHeading.variable,
          )}
        >
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <QueryProvider>{children}</QueryProvider>
              <Analytics />
              <Toaster />
              <TailwindIndicator />
            </ThemeProvider>
          </NextIntlClientProvider>
          {env.NEXT_PUBLIC_GA_ID && (
            <>
              <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} />
              <ClaritySnippet />
            </>
          )}
          {env.NEXT_PUBLIC_UMAMI_DATA_ID && (
            <Script
              async
              src="https://sa.douni.one/st.js"
              data-website-id={env.NEXT_PUBLIC_UMAMI_DATA_ID}
            />
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
