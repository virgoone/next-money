import { MetadataRoute } from "next";
import { prisma } from "@/db/prisma";
import { FluxTaskStatus } from "@/db/type";
import { FluxHashids } from "@/db/dto/flux.dto";

import { allPosts } from "contentlayer/generated";

import { defaultLocale, locales, pathnames } from "@/config";
import { env } from "@/env.mjs";
import { getPathname } from "@/lib/navigation";

const getFluxUrl = async () => {
  const fluxs = await prisma.fluxData.findMany({
    where: {
      isPrivate: false,
      taskStatus: {
        in: [FluxTaskStatus.Succeeded],
      },
    },
    select: {
      id: true
    }
  });
  return fluxs.map((flux) => `/d/${FluxHashids.encode(flux.id)}`)
}
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const keys = Object.keys(pathnames) as Array<keyof typeof pathnames>;
  const posts = await Promise.all(
    allPosts
      .filter((post) => post.published && post.language === defaultLocale)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((post) => post.slug?.replace(`/${defaultLocale}`, "")),
  );
  const fluxDataCount = await prisma.fluxData.count({
    where: {
      isPrivate: false,
      taskStatus: {
        in: [FluxTaskStatus.Succeeded],
      },
    }
  });
  const pageCount = Math.ceil(fluxDataCount / 24);
  const explorePages = Array.from({ length: pageCount }, (_, i) => i === 0 ? `/explore` : `/explore/${i + 1}`);

  function getUrl(
    key: keyof typeof pathnames,
    locale: (typeof locales)[number],
  ) {
    const pathname = getPathname({ locale, href: key });
    return `${env.NEXT_PUBLIC_SITE_URL}/${locale === defaultLocale ? "" : locale}${pathname === "/" ? "" : pathname}`;
  }

  // return [...posts, ...keys].map((key) => ({
  //   url: getUrl(key, defaultLocale),
  //   priority: 0.7,
  //   changeFrequency: 'daily',
  //   alternates: {
  //     languages: Object.fromEntries(
  //       locales.map((locale) => [locale, getUrl(key, locale)]),
  //     ),
  //   },
  // }));
  const fluxUrls = await getFluxUrl();

  return [...posts, ...keys, ...fluxUrls, ...explorePages].flatMap((key) =>
    locales.map((locale) => ({
      url: getUrl(key, locale),
      priority: 0.7,
      changeFrequency: "daily",
    })),
  );
}
