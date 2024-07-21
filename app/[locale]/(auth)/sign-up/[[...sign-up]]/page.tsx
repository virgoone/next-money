import { SignUp } from "@clerk/nextjs";
import { Container } from "@/components/layout/container";
import { unstable_setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

export default function Page({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  return (
    <Container className="mt-24 flex items-center justify-center">
      <SignUp />
    </Container>
  );
}
