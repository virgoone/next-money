"use client";

import React, { useEffect, useId, useRef, useState } from "react";

import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import copy from "copy-to-clipboard";
import { debounce } from "lodash-es";
import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import qs from "query-string";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";
import { toast } from "sonner";
import Link from "next/link";
import Loading from "@/components/loading";
import BlurFade from "@/components/magicui/blur-fade";
import PlaygroundLoading from "@/components/playground/loading";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { LoraConfig, ModelName, Ratio } from "@/config/constants";
import { FluxSelectDto } from "@/db/type";
import { cn, createRatio } from "@/lib/utils";

import { FluxTaskStatus } from "../playground";
import { Button } from "../ui/button";
import Container from "./container";
import { DownloadAction } from "./download-action";
import LoadMoreLoading from "./loading";

const useQueryMineFluxMutation = (config?: {
  explore?: boolean;
  onSuccess: (result: any) => void;
}) => {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (values: any) => {
      const path = config?.explore ? "/api/explore" : "/api/mine-flux";
      const res = await fetch(`${path}?${qs.stringify(values)}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (!res.ok && res.status >= 500) {
        throw new Error("Network response error");
      }

      return res.json();
    },
    onSuccess: async (result) => {
      config?.onSuccess(result);
    },
  });
};

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  768: 2,
  640: 1,
};

export default function History({ locale, explore }: { locale: string, explore?: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [init, setInit] = useState(false);
  const t = useTranslations("History");
  const id = useId();
  const [pageParams, setPageParams] = useState({
    page: 1,
    pageSize: 12,
  });
  const [hasMore, setHasMore] = useState(true);
  const [dataSource, setDataSource] = useState<FluxSelectDto[]>([]);
  const useQueryMineFlux = useQueryMineFluxMutation({
    explore,
    onSuccess(result) {
      const { page, pageSize, total, data } = result.data ?? {};
      setDataSource(page === 1 ? data : [...dataSource, ...data]);
      setPageParams({ page, pageSize });
      setHasMore(page * pageSize < total);
      setInit(true);
    },
  });

  useEffect(() => {
    useQueryMineFlux.mutateAsync({
      page: pageParams.page,
      pageSize: pageParams.pageSize,
    });
  }, []);

  const loadMore = () => {
    console.log("load more");
    useQueryMineFlux.mutateAsync({
      page: pageParams.page + 1,
      pageSize: pageParams.pageSize,
    });
  };

  const copyPrompt = (prompt: string) => {
    copy(prompt);
    toast.success(t("action.copySuccess"));
  };

  const debounceLoadMore = debounce(loadMore, 500);

  return (
    <Container className={
      cn({
        "h-[calc(100vh_-_76px)]": !explore,
        "min-h-screen": explore,
      })
    }>
      <div
        className="no-scrollbar h-full overflow-y-auto overflow-x-hidden"
        id={id}
        ref={containerRef}
      >
        <InfiniteScroll
          scrollThreshold={0.58}
          dataLength={dataSource.length}
          next={debounceLoadMore}
          hasMore={hasMore}
          loader={
            init ? (
              <div
                className={cn("flex h-16 w-full items-center justify-center", {
                  "h-96": !init,
                })}
              >
                <LoadMoreLoading />
              </div>
            ) : (
              <div className="flex h-full min-h-96 w-full items-center justify-center">
                <Loading />
              </div>
            )
          }
          className="pb-10"
          // onScroll={handleScroll}
          scrollableTarget={id}
        >
          {dataSource.length > 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex w-auto"
              columnClassName="bg-clip-padding pl-4 first:pl-0"
            >
              {dataSource.map((item, idx) => (
                <div
                  key={item.id}
                  className="border-stroke-light bg-surface-300 hover:border-stroke-strong mb-4 flex break-inside-avoid flex-col space-y-4 overflow-hidden rounded-xl border relative"
                >
                  {item.taskStatus === FluxTaskStatus.Processing ? (
                    <div
                      className={`bg-pattern flx w-full items-center justify-center rounded-xl ${createRatio(item.aspectRatio as Ratio)} pointer-events-none`}
                    >
                      <PlaygroundLoading />
                    </div>
                  ) : (
                    <BlurFade
                      key={item?.imageUrl!}
                      delay={0.25 + (idx % pageParams.pageSize) * 0.05}
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
                  {
                    !explore && (
                      <>
                        <div className="text-content-light inline-block px-4 py-2 text-sm">
                          <p className="line-clamp-4 italic md:line-clamp-6 lg:line-clamp-[8]">
                            {item.inputPrompt}
                          </p>
                        </div>
                        <div className="flex flex-row flex-wrap space-x-1 px-2">
                          {ModelName[item.model] && (
                            <div className="bg-surface-alpha-strong text-content-base inline-flex items-center rounded-md border border-transparent px-1.5 py-0.5 font-mono text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                              {ModelName[item.model]}
                            </div>
                          )}
                          {item.loraName && LoraConfig[item.loraName]?.styleName && (
                            <div className="bg-surface-alpha-strong text-content-base inline-flex items-center rounded-md border border-transparent px-1.5 py-0.5 font-mono text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                              {LoraConfig[item.loraName]?.styleName}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-row justify-between space-x-2 p-4 pt-0">
                          <button
                            className="focus-ring text-content-strong border-stroke-strong hover:border-stroke-stronger data-[state=open]:bg-surface-alpha-light inline-flex h-8 items-center justify-center whitespace-nowrap rounded-lg border bg-transparent px-2.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
                            onClick={() => copyPrompt(item.inputPrompt!)}
                          >
                            <Copy className="icon-xs me-1" />
                            {t("action.copy")}
                          </button>
                          <DownloadAction
                            disabled={item.taskStatus === FluxTaskStatus.Processing}
                            id={item.id}
                          />
                        </div>
                      </>
                    )
                  }
                </div>
              ))}
            </Masonry>
          ) : init ? (
            <div className="flex min-h-96 items-center justify-center">
              <EmptyPlaceholder>
                <EmptyPlaceholder.Icon name="post" />
                <EmptyPlaceholder.Title>
                  {t("empty.title")}
                </EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  {t("empty.description")}
                </EmptyPlaceholder.Description>
                <Button variant="outline">{t("action.generate")}</Button>
              </EmptyPlaceholder>
            </div>
          ) : (
            <div className="hidden"></div>
          )}
        </InfiniteScroll>
        {/* <ScrollBar className="hidden" /> */}
      </div>
    </Container>
  );
}
