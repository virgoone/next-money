import { MetadataRoute } from "next";

import { allPosts } from "contentlayer/generated";

import { defaultLocale, locales, pathnames } from "@/config";
import { env } from "@/env.mjs";
import { getPathname } from "@/lib/navigation";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const keys = Object.keys(pathnames) as Array<keyof typeof pathnames>;
  const posts = await Promise.all(
    allPosts
      .filter((post) => post.published && post.language === defaultLocale)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((post) => post.slug?.replace(`/${defaultLocale}`, "")),
  );

  function getUrl(
    key: keyof typeof pathnames,
    locale: (typeof locales)[number],
  ) {
    const pathname = getPathname({ locale, href: key });
    return `${env.NEXT_PUBLIC_SITE_URL}/${locale}${pathname === "/" ? "" : pathname}`;
  }

  return [...posts, ...keys].map((key) => ({
    url: getUrl(key, defaultLocale),
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, getUrl(key, locale)]),
      ),
    },
  }));
}
