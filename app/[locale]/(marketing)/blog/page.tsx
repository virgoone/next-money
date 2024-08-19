import { allPosts } from "contentlayer/generated";

import { BlogPosts } from "@/components/content/blog-posts";
import { getBlurDataURL } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: PageProps) {
  const t = await getTranslations({ locale });
  return {
    title: `${t("BlogPage.title")} - ${t("LocaleLayout.title")}`,
    description: t("BlogPage.description"),
  };
}

export default async function BlogPage() {
  const posts = await Promise.all(
    allPosts
      .filter((post) => post.published)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(async (post) => ({
        ...post,
        blurDataURL: await getBlurDataURL(post.image),
      })),
  );

  return <BlogPosts posts={posts} />;
}
