import { SignIn } from "@clerk/nextjs";
import { unstable_setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";

type Props = {
  params: Promise<{ locale: string }>;
};


export default async function Page({ params }: Props) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  return (
    <Container className="mt-24 flex items-center justify-center">
      <SignIn />
    </Container>
  );
}
