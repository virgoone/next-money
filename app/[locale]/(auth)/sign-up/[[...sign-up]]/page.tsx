import { SignUp } from "@clerk/nextjs";
import { unstable_setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";

type Props = {
  params: { locale: string };
};

export const runtime = "edge";

export default function Page({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  return (
    <Container className="mt-24 flex items-center justify-center">
      <SignUp />
    </Container>
  );
}
