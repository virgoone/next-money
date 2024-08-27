import { useTranslations } from "next-intl";

import { UserArrowLeftIcon } from "@/assets";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export default function SchnellIntro() {
  const t = useTranslations("IndexPage");

  return (
    <section>
      <div className="container mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
            <img
              alt={t("schnell.description")}
              src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="lg:py-24">
            <h2 className="text-3xl font-bold sm:text-4xl">
              {t("schnell.title")}
            </h2>

            <p className="mt-4 text-gray-600 dark:text-muted-foreground">
              {t("schnell.description")}
            </p>
            <Link
              href="/flux-schnell"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "min-w-34 mt-4 gap-2 rounded-full",
              )}
            >
              <UserArrowLeftIcon className="mr-2 size-4" />
              <span>{t("schnell.action")}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
