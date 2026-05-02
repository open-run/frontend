'use client'

import ErrorFallback from '@shared/ErrorFallback'

export default function ErrorPage() {
  return (
    <section className='h-screen w-screen'>
      <ErrorFallback type='large' />
    </section>
  )
}
