import { getTranslations } from "next-intl/server";

import { BlogHeaderLayout } from "@/components/content/blog-header-layout";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface BlogLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function BlogLayout({
  children,
  params: { locale },
}: BlogLayoutProps) {
  const t = await getTranslations({ locale, namespace: "BlogPage" });

  return (
    <>
      <BlogHeaderLayout title={t("title")} description={t("description")} />
      <MaxWidthWrapper className="pb-16">{children}</MaxWidthWrapper>
    </>
  );
}
