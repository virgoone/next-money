import { redirect } from "next/navigation";

import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import History from "@/components/history";
import { getFluxDataByPage } from "@/actions/flux-action";
import PlaygroundLoading from "@/components/playground/loading";
import { FluxTaskStatus } from "@/components/playground";
import BlurFade from "@/components/magicui/blur-fade";
import { Link } from "@/lib/navigation";
import { cn, createRatio } from "@/lib/utils";
import { LoraConfig, ModelName, Ratio } from "@/config/constants";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface RootLayoutProps {
  params: { locale: string, page: number };
}
export async function generateMetadata({
  params: { locale, page },
}: Omit<RootLayoutProps, "children">) {
  const t = await getTranslations({ locale, namespace: "ExplorePage" });

  return {
    title: `${t("layout.title")} - Page ${page}`,
    description: t("layout.description"),
    keywords: t("layout.keywords"),
  };
}
const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  768: 2,
  640: 1,
};
export default async function ExplorePage({
  params,
}: {
  params: { locale: string, page: number };
}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations({ namespace: "ExplorePage" });
  const page = Number(params.page) || 2;
  const pageSize = 24;
  const fluxData = await getFluxDataByPage({ page, pageSize });

  return (
    <section className="space-y-6 py-10 sm:py-10 lg:py-10">

      <div
        className="w-full relative"
        style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
      >
        <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
          <h1 className="text-balance font-urban text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-[56px]">
            {t("title")}
          </h1>

          <p
            className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            {t("description")}
          </p>
          {/* <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto"
            columnClassName="bg-clip-padding pl-4 first:pl-0"
          > */}
          <div className="masonry-grid columns-1 md:columns-2 lg:columns-3 xl:columns-4">
            {fluxData.data?.data?.map((item, idx) => (
              <div
                key={item.id}
                className="masonry-grid-item w-full border-stroke-light bg-surface-300 hover:border-stroke-strong mb-4 flex break-inside-avoid flex-col space-y-4 overflow-hidden rounded-xl border relative"
              >
                <Link href={`/d/${item.id}`}>
                  {item.taskStatus === FluxTaskStatus.Processing ? (
                    <div
                      className={`bg-pattern flx w-full h-full items-center justify-center rounded-xl ${createRatio(item.aspectRatio as Ratio)} pointer-events-none`}
                    >
                      <PlaygroundLoading />
                    </div>
                  ) : (
                    <BlurFade
                      key={item?.imageUrl!}
                      delay={0.25 + (idx % pageSize) * 0.05}
                      inView
                    >
                      <img
                        src={item.imageUrl!}
                        alt={item.inputPrompt!}
                        title={item.inputPrompt!}
                        className={`w-full rounded-xl object-cover ${createRatio(item.aspectRatio as Ratio)} pointer-events-none`}
                      />
                    </BlurFade>
                  )}
                </Link>
                <Link
                  className="absolute right-1 top-1 !m-0"
                  target="_blank"
                  href={`https://pinterest.com/pin/create/button/?url=https://pinterest.com/pin/create/button/?description=${encodeURIComponent(item.inputPrompt!)}&url=${encodeURIComponent(item.imageUrl!)}`}
                >
                  <span className="[&>svg]:h-7 [&>svg]:w-7 [&>svg]:fill-[#e60023]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                      <path d="M496 256c0 137-111 248-248 248-25.6 0-50.2-3.9-73.4-11.1 10.1-16.5 25.2-43.5 30.8-65 3-11.6 15.4-59 15.4-59 8.1 15.4 31.7 28.5 56.8 28.5 74.8 0 128.7-68.8 128.7-154.3 0-81.9-66.9-143.2-152.9-143.2-107 0-163.9 71.8-163.9 150.1 0 36.4 19.4 81.7 50.3 96.1 4.7 2.2 7.2 1.2 8.3-3.3 .8-3.4 5-20.3 6.9-28.1 .6-2.5 .3-4.7-1.7-7.1-10.1-12.5-18.3-35.3-18.3-56.6 0-54.7 41.4-107.6 112-107.6 60.9 0 103.6 41.5 103.6 100.9 0 67.1-33.9 113.6-78 113.6-24.3 0-42.6-20.1-36.7-44.8 7-29.5 20.5-61.3 20.5-82.6 0-19-10.2-34.9-31.4-34.9-24.9 0-44.9 25.7-44.9 60.2 0 22 7.4 36.8 7.4 36.8s-24.5 103.8-29 123.2c-5 21.4-3 51.6-.9 71.2C65.4 450.9 0 361.1 0 256 0 119 111 8 248 8s248 111 248 248z"></path>
                    </svg>
                  </span>
                </Link>
              </div>
            ))}
          </div>

          <Pagination className="justify-end">
            <PaginationContent>
              {page !== 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`${params.locale === 'en' ? '' : `/${params.locale}`}/explore/${page - 1}`}
                  />
                </PaginationItem>
              )}
              {fluxData.data?.total > page * pageSize && (
                <PaginationItem>
                  <PaginationNext
                    href={`${params.locale === 'en' ? '' : `/${params.locale}`}/explore/${page + 1}`}
                  >
                  </PaginationNext>
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </section>
  );
}
