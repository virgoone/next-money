import { SignIn } from '@clerk/nextjs'

import { Container } from '~/components/layout/container'

export default function Page() {
  return (
    <Container className="mt-24 flex items-center justify-center">
      <SignIn />
    </Container>
  )
}
