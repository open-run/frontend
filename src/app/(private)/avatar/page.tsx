import { Metadata } from 'next'
import { Suspense } from 'react'
import AvatarPage from '@components/avatar/AvatarPage'
import AvatarPageSkeleton from '@components/avatar/AvatarPageSkeleton'

export default function Page() {
  return (
    <Suspense fallback={<AvatarPageSkeleton />}>
      <AvatarPage />
    </Suspense>
  )
}

export const metadata: Metadata = {
  title: '아바타',
}
