"use client";

import { useContext, useState } from "react";
import Link from "next/link";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

import { BillingFormButton } from "@/components/forms/billing-form-button";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { pricingData } from "@/config/subscriptions";
import { ChargeProductDto } from "@/db/schema";
import { url } from "@/lib";
import { usePathname } from "@/lib/navigation";
import { cn, formatPrice } from "@/lib/utils";
import { UserSubscriptionPlan } from "@/types";
import { SubscriptionPlan } from "@/types/index";

interface PricingCardsProps {
  userId?: string;
  chargeProduct?: ChargeProductDto[];
}

const PricingCard = ({
  userId,
  offer,
}: {
  userId?: string;
  offer: ChargeProductDto;
}) => {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm",
        offer.title.toLocaleLowerCase() === "pro"
          ? "-m-0.5 border-2 border-purple-400"
          : "",
      )}
      key={offer.title}
    >
      <div className="min-h-[150px] items-start space-y-4 bg-muted/50 p-6">
        <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-muted-foreground">
          {offer.title}
        </p>

        <div className="flex flex-row">
          <div className="flex items-end">
            <div className="flex text-left text-3xl font-semibold leading-6">
              {offer.originalAmount && offer.originalAmount > 0 ? (
                <>
                  <span className="mr-2 text-base text-muted-foreground/80 line-through">
                    {formatPrice(offer.originalAmount, "$")}
                  </span>
                  <span>{formatPrice(offer.amount, "$")}</span>
                </>
              ) : (
                `${formatPrice(offer.amount, "$")}`
              )}
            </div>
            <div className="-mb-1 ml-2 text-left text-sm font-medium text-muted-foreground">
              <div>{offer.credit} Credit</div>
            </div>
          </div>
        </div>
        <div className="text-left text-sm text-muted-foreground">
          <div>No recurring</div>
        </div>
      </div>

      <div className="flex h-full flex-col justify-between gap-16 p-6">
        <ul className="space-y-2 text-left text-sm font-medium leading-normal">
          {offer.message &&
            offer.message.split(",")?.map((feature) => (
              <li className="flex items-start gap-x-3" key={feature}>
                <Icons.check className="size-5 shrink-0 text-purple-500" />
                <p>{feature}</p>
              </li>
            ))}

          {/* {offer.limitations.length > 0 &&
            offer.limitations.map((feature) => (
              <li
                className="flex items-start text-muted-foreground"
                key={feature}
              >
                <Icons.close className="mr-3 size-5 shrink-0" />
                <p>{feature}</p>
              </li>
            ))} */}
        </ul>
        <SignedIn>
          <BillingFormButton offer={offer} />
        </SignedIn>

        <SignedOut>
          <div className="flex justify-center">
            <SignInButton mode="modal" forceRedirectUrl={url(pathname).href}>
              <Button
                variant={
                  offer.title.toLocaleLowerCase() === "pro"
                    ? "default"
                    : "outline"
                }
                rounded="full"
                // onClick={() => setShowSignInModal(true)}
              >
                Sign in
              </Button>
            </SignInButton>
          </div>
        </SignedOut>
      </div>
    </div>
  );
};
export function PricingCards({ userId, chargeProduct }: PricingCardsProps) {
  const t = useTranslations("PricingPage");
  const isYearlyDefault = false;
  const [isYearly, setIsYearly] = useState<boolean>(!!isYearlyDefault);

  const toggleBilling = () => {
    setIsYearly(!isYearly);
  };

  return (
    <MaxWidthWrapper>
      <section className="flex flex-col items-center text-center">
        <HeaderSection label={t("label")} title={t("title")} />
        <div className="mt-4">
          <p className="mb-7 inline-flex items-center justify-between rounded-xl bg-blue-100 px-2 py-2 pe-4 text-sm text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 md:rounded-full md:px-1 md:py-1">
            <span className="text-sm font-medium">
              {t("tip.title")}&nbsp;(
              {t("tip.subtitle")}&nbsp;
              <a
                href="/contact"
                className="font-semibold text-blue-700 underline decoration-blue-500 dark:text-white dark:decoration-white"
              >
                {t("tip.contact")}
              </a>
              &nbsp;)
            </span>
          </p>
        </div>
        {/* <div className="mb-4 mt-10 flex items-center gap-5">
          <ToggleGroup
            type="single"
            size="sm"
            defaultValue={isYearly ? "yearly" : "monthly"}
            onValueChange={toggleBilling}
            aria-label="toggle-year"
            className="h-9 overflow-hidden rounded-full border bg-background p-1 *:h-7 *:text-muted-foreground"
          >
            <ToggleGroupItem
              value="yearly"
              className="rounded-full px-5 data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground"
              aria-label="Toggle yearly billing"
            >
              Yearly (-20%)
            </ToggleGroupItem>
            <ToggleGroupItem
              value="monthly"
              className="rounded-full px-5 data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground"
              aria-label="Toggle monthly billing"
            >
              Monthly
            </ToggleGroupItem>
          </ToggleGroup>
        </div> */}

        <div className="grid gap-5 bg-inherit py-5 lg:grid-cols-3">
          {chargeProduct?.map((offer) => (
            <PricingCard offer={offer} key={offer.id} />
          ))}
        </div>

        <p className="mt-3 text-balance text-center text-base text-muted-foreground">
          Email{" "}
          <a
            className="font-medium text-primary hover:underline"
            href="mailto:support@saas-starter.com"
          >
            support@saas-starter.com
          </a>{" "}
          for to contact our support team.
          <br />
          <strong>
            You can test the subscriptions and won&apos;t be charged.
          </strong>
        </p>
      </section>
    </MaxWidthWrapper>
  );
}
