import * as React from 'react'

import { Button } from '@react-email/button'
import { Html } from '@react-email/html'

export default function Email() {
  return (
    <Html>
      <Button
        href="https://example.com"
        className='px-4 py-3 '
        style={{ background: '#000', color: '#fff' }}
      >
        Click me
      </Button>
    </Html>
  )
}
