import { redirect } from "next/navigation";

import { setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { prisma } from "@/db/prisma";

import { SubbedCelebration } from "./SubbedCelebration";

export const metadata = {
  title: "感谢你的订阅",
};

export default async function ConfirmPage({
  params,
}: {
  params: Promise<{ token: string; locale: string }>;
}) {
  const { locale, token } = await params;
  setRequestLocale(locale);

  const subscriber = await prisma.subscribers.findFirst({
    where: {
      token: token,
    },
  });

  if (!subscriber || subscriber.subscribedAt) {
    redirect("/");
  }

  await prisma.subscribers.update({
    where: {
      id: subscriber.id,
    },
    data: {
      subscribedAt: new Date(),
      token: null,
    },
  });

  return (
    <Container className="mt-16 sm:mt-32">
      <header className="relative mx-auto flex w-full max-w-2xl items-center justify-center">
        <h1
          className="w-full text-center text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl"
          id="subbed-celebration"
        >
          🥳 感谢你的订阅 🎉
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400"></p>
      </header>
      <SubbedCelebration />
    </Container>
  );
}
