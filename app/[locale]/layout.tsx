import "@/styles/globals.css";
import "../clerk.css";
import "../prism.css";

import { enUS, zhCN } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  unstable_setRequestLocale,
} from "next-intl/server";
import { ThemeProvider } from "next-themes";

import { fontHeading, fontSans, fontUrban } from "@/assets/fonts";
import { Analytics } from "@/components/analytics";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/toaster";
import { locales } from "@/config";
import { siteConfig } from "@/config/site";
import { cn, constructMetadata } from "@/lib/utils";

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
      },
    },
    openGraph: {
      images: siteConfig.ogImage,
    },
    description: t("description"),
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  unstable_setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <ClerkProvider localization={locale === "zh" ? zhCN : enUS}>
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
        </body>
      </html>
    </ClerkProvider>
  );
}
