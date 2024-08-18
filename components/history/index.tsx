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

import Loading from "@/components/loading";
import BlurFade from "@/components/magicui/blur-fade";
import PlaygroundLoading from "@/components/playground/loading";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { ModelName, Ratio } from "@/config/constants";
import { FluxSelectDto } from "@/db/type";
import { cn, createRatio } from "@/lib/utils";

import { FluxTaskStatus } from "../playground";
import { Button } from "../ui/button";
import Container from "./container";
import { DownloadAction } from "./download-action";
import LoadMoreLoading from "./loading";

const useQueryMineFluxMutation = (config?: {
  onSuccess: (result: any) => void;
}) => {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (values: any) => {
      const res = await fetch(`/api/mine-flux?${qs.stringify(values)}`, {
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

export default function History({ locale }: { locale: string }) {
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
    <Container>
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
                  className="border-stroke-light bg-surface-300 hover:border-stroke-strong mb-4 flex break-inside-avoid flex-col space-y-4 overflow-hidden rounded-xl border"
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
                        className={`w-full rounded-xl object-cover ${createRatio(item.aspectRatio as Ratio)} pointer-events-none`}
                      />
                    </BlurFade>
                  )}

                  <div className="text-content-light inline-block px-4 py-2 text-sm">
                    <p className="line-clamp-4 italic md:line-clamp-6 lg:line-clamp-[8]">
                      {item.inputPrompt}
                    </p>
                  </div>
                  <div className="flex flex-row flex-wrap space-x-1 px-4">
                    <div className="bg-surface-alpha-strong text-content-base inline-flex items-center rounded-md border border-transparent px-1.5 py-0.5 font-mono text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      {ModelName[item.model]}
                    </div>
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
