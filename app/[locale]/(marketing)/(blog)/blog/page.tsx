import { Container } from "@/components/layout/container";
import { SocialLink } from "@/components/links/SocialLink";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import Balancer from "react-wrap-balancer";

import { BlogPosts } from "../BlogPosts";

interface PageProps {
  params: { locale: string };
}
export async function generateMetadata({
  params: { locale },
}: PageProps) {
  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      title: t("title"),
      description: t("description"),
      card: "summary_large_image",
    },
  };
}

// TODO: add pagination or infinite scroll
export default function BlogPage({ params }: PageProps) {
  unstable_setRequestLocale(params.locale);
  const t = useTranslations("BlogPage");
  return (
    <Container className="mb-16 mt-16 sm:mt-24">
      <header className="max-w-2xl">
        <h2 className="font-book font-styling font-display font-gradient mb-16 mt-2 text-[3rem] leading-[120%] tracking-tight md:text-[3.5rem]">
          {t("title")}
          <SocialLink
            className="ml-1 inline-flex"
            href="/feed.xml"
            platform="rss"
          />
        </h2>
      </header>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-20 lg:grid-cols-2 lg:gap-8">
        <BlogPosts locale={params.locale} limit={20} />
      </div>
    </Container>
  );
}

export const revalidate = 60;
