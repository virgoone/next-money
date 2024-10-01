import { redirect } from "next/navigation";

import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getFluxDataByPage, getFluxById } from "@/actions/flux-action";
import { Link } from "@/lib/navigation";
import { cn, createRatio } from "@/lib/utils";
import { LoraConfig, ModelName, Ratio } from "@/config/constants";
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDate } from "@/lib/utils"
import { CopyButton } from "@/components/shared/copy-button";
import { FluxTaskStatus } from "@/db/type";
import { DownloadAction } from "@/components/history/download-action";
import { env } from "@/env.mjs";
import { prisma } from "@/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { FluxHashids } from "@/db/dto/flux.dto";

interface RootPageProps {
  params: { locale: string, slug: string };
}

export async function generateStaticParams() {
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
  return fluxs.map((flux) => ({
    slug: FluxHashids.encode(flux.id)
  }))
}

export async function generateMetadata({
  params: { locale, slug },
}: Omit<RootPageProps, "children">) {
  const t = await getTranslations({ locale, namespace: "ExplorePage" });
  const flux = await getFluxById(slug);
  if (!flux) {
    return notFound();
  }
  return {
    title: t("layout.title"),
    description: flux.inputPrompt,
    openGraph: {
      title: "Flux AI Image Generator",
      description: flux.inputPrompt,
      images: [
        {
          url: flux.imageUrl!,
        },
      ],
      type: 'article',
    },
    image: flux.imageUrl,
  };
}
const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  768: 2,
  640: 1,
};
export default async function FluxPage({
  params,
}: RootPageProps) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations({ namespace: "ExplorePage" });
  const flux = await getFluxById(params.slug);
  if (!flux) {
    return notFound();
  }
  const { userId } = auth();

  if (env.VERCEL_ENV === 'production') {
    const [fluxId] = FluxHashids.decode(flux.id)
    await prisma.fluxData.update({
      where: {
        id: fluxId as number
      },
      data: {
        viewsNum: {
          increment: 1
        }
      }
    })
    if (userId) {
      await prisma.fluxViews.create({
        data: {
          fluxId: fluxId as number,
          userId: userId
        }
      })
    }
  }

  return (
    <section className="container mx-auto py-20">
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="w-full md:w-1/2 checkerboard h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <img
            src={flux.imageUrl!}
            alt={flux.inputPrompt!}
            title={flux.inputPrompt!}
            className={`h-full rounded-xl object-cover ${createRatio(flux.aspectRatio as Ratio)} pointer-events-none`}
          />
        </div>
        <div className="w-full md:w-1/2 p-4 bg-background text-foreground">
          <ScrollArea className="h-full">
            <Card className="border-none shadow-none">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">{t("flux.prompt")}</h2>
                  <p className="text-sm text-muted-foreground">
                    {flux.inputPrompt}
                    <CopyButton
                      value={flux.inputPrompt!}
                      className={cn(
                        "relative ml-2",
                        "duration-250 transition-all",
                      )}
                    />
                  </p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">{t("flux.executePrompt")}</h2>
                  <p className="text-sm text-muted-foreground">
                    {flux.executePrompt}
                    <CopyButton
                      value={flux.executePrompt!}
                      className={cn(
                        "relative ml-2",
                        "duration-250 transition-all",
                      )}
                    />
                  </p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">{t("flux.model")}</h2>
                  <p className="text-sm text-muted-foreground">{ModelName[flux.model]}</p>
                </div>
                {flux.loraName && <div>
                  <h2 className="text-lg font-semibold mb-2">{t("flux.lora")}</h2>
                  <p className="text-sm text-muted-foreground">{LoraConfig[flux.loraName]?.styleName}</p>
                </div>}
                <div>
                  <h2 className="text-lg font-semibold mb-2">{t("flux.resolution")}</h2>
                  <p className="text-sm text-muted-foreground">{flux.aspectRatio}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">{t("flux.createdAt")}</h2>
                  <p className="text-sm text-muted-foreground">{formatDate(flux.createdAt!)}</p>
                </div>
                <div className="flex flex-row justify-between space-x-2 pt-0">
                  <DownloadAction
                    showText
                    id={flux.id}
                  />
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        </div>
      </div>
    </section>
  );
}
