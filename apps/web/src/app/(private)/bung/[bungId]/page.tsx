import { Metadata } from 'next'
import { Suspense } from 'react'
import BungDetails from '@components/bung/BungDetails'
import Skeleton from '@shared/Skeleton'
import { fetchBungDetail } from '@apis/v1/bungs/[bungId]'

type Props = {
  params: Promise<{
    bungId: string
  }>
  searchParams: Promise<{
    chatAction?: string
  }>
}

export default async function Page({ params, searchParams }: Props) {
  const { bungId } = await params
  const { chatAction } = await searchParams
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BungDetailPage bungId={bungId} chatAction={chatAction} />
    </Suspense>
  )
}

async function BungDetailPage({ bungId, chatAction }: { bungId: string; chatAction?: string }) {
  const bungDetail = await fetchBungDetail({ bungId })
  return <BungDetails details={bungDetail.data} initialChatAction={chatAction} />
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bungId } = await params
  const bungDetail = await fetchBungDetail({ bungId })
  return {
    title: bungDetail.data.name,
  }
}

function LoadingFallback() {
  return (
    <section className='flex h-screen w-screen flex-col bg-gray-lighten'>
      <div className='h-200 bg-gray' />
      <div className='-translate-y-15 rounded-[8px_8px_0_0] bg-gray-lighten'>
        <div className='mb-24 rounded-8 bg-white p-16 shadow-floating-primary'>
          <Skeleton className='mb-16 h-30 w-180 rounded-10 bg-gray' />
          <Skeleton className='mb-8 h-19 w-180 rounded-10 bg-gray' />
          <Skeleton className='mb-8 h-19 w-180 rounded-10 bg-gray' />
          <Skeleton className='mb-8 h-19 w-180 rounded-10 bg-gray' />
          <Skeleton className='mb-24 h-19 w-180 rounded-10 bg-gray' />
          <Skeleton className='h-56 w-full rounded-10 bg-gray' />
        </div>
        <Skeleton className='mb-8 ml-16 h-24 w-152 rounded-10 bg-gray' />
        <ul className='flex gap-8 px-16'>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`${index}`} className='aspect-[1] w-76 rounded-8 bg-gray' />
          ))}
        </ul>
      </div>
    </section>
  )
}
