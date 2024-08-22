import * as React from "react";

import { useTranslations } from "next-intl";

import { ModeToggle } from "@/components/layout/mode-toggle";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import NewsletterForm from "../forms/newsletter-form";
import { Icons } from "../shared/icons";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  const t = useTranslations("PageLayout");
  return (
    <footer
      className={cn("container border-t", "w-full p-6 md:py-12", className)}
    >
      <div className="flex max-w-7xl flex-col items-center justify-between gap-4 text-sm md:flex-row">
        <div className="flex items-center gap-2">
          <Icons.logo className="h-6 w-6" />
          <span className="font-medium">Fluxaipro.Art Inc.</span>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="flex flex-1 items-center space-x-3">
            <Link
              href="/terms-of-use"
              className="underline-offset-4 hover:underline"
              prefetch={false}
            >
              {t("footer.term")}
            </Link>
            <Link
              href="/privacy-policy"
              className="underline-offset-4 hover:underline"
              prefetch={false}
            >
              {t("footer.privacy")}
            </Link>
            <Link
              href="mailto:support@fluxaipro.art"
              className="underline-offset-4 hover:underline"
              prefetch={false}
            >
              {t("footer.contact")}
            </Link>
            <ModeToggle />
          </div>

          <p className="text-muted-foreground">
            &copy; 2024 fluxaipro.Art. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
