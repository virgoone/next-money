import { SignUp } from "@clerk/nextjs";
import { setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";

type Props = {
  params: Promise<{ locale: string }>;
};



export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container className="mt-24 flex items-center justify-center">
      <SignUp />
    </Container>
  );
}
