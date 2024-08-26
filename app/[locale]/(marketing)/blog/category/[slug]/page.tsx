import { Metadata } from "next";
import { notFound } from "next/navigation";

import { allPosts } from "contentlayer/generated";
import { getTranslations } from "next-intl/server";

import { BlogCard } from "@/components/content/blog-card";
import { BLOG_CATEGORIES } from "@/config/blog";
import { constructMetadata, getBlurDataURL } from "@/lib/utils";

export async function generateStaticParams() {
  return BLOG_CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}
interface PageProps {
  params: { locale: string; slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata | undefined> {
  const category = BLOG_CATEGORIES.find(
    (category) => category.slug === params.slug,
  );
  if (!category) {
    return;
  }
  const t = await getTranslations({ locale: params.locale });

  const { title, description } = category;

  return constructMetadata({
    title: `${title} Posts - ${t("LocaleLayout.title")}`,
    description,
  });
}

export default async function BlogCategory({
  params,
}: {
  params: {
    slug: string;
    locale: string;
  };
}) {
  const category = BLOG_CATEGORIES.find((ctg) => ctg.slug === params.slug);

  if (!category) {
    notFound();
  }

  const articles = await Promise.all(
    allPosts
      .filter((post) => post.categories.includes(category.slug) && post.language === params.locale)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(async (post) => ({
        ...post,
        blurDataURL: await getBlurDataURL(post.image),
      })),
  );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, idx) => (
        <BlogCard key={article._id} data={article} priority={idx <= 2} />
      ))}
    </div>
  );
}
