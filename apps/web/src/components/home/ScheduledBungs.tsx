import Link from 'next/link'
import ErrorFallback from '@shared/ErrorFallback'
import Skeleton from '@shared/Skeleton'
import Spacing from '@shared/Spacing'
import withBoundary from '@shared/withBoundary'
import { useMyBungsQuery } from '@apis/v1/bungs/my-bungs/query'
import BungCard from './BungCard'
import CreateBungButton from './CreateBungButton'

export default function ScheduledBungs() {
  return (
    <section className='flex flex-col px-16'>
      <WrappedBungList />
      <CreateBungButton>벙 만들기</CreateBungButton>
    </section>
  )
}

function BungList() {
  /* 실시간 타이머를 포함하고 있는 컴포넌트는 클라이언트 컴포넌트로 렌더링해야 합니다. */
  const { data: myBungs } = useMyBungsQuery({
    isOwned: null,
    status: 'ONGOING',
    page: 0,
    limit: 10,
  })

  return (
    <>
      <div className='mx-auto mb-8 flex w-full max-w-[500px] justify-between'>
        <span className='text-20 font-bold text-black'>나의 벙</span>
        {myBungs!.data.length === 0 && (
          <span className='place-content-center text-12 text-black'>아직 일정이 없어요</span>
        )}
      </div>
      <ul className='mb-8'>
        {myBungs!.data.map((item) => (
          <li key={`myBungs-${item.bungId}`}>
            <Link className='w-full text-start' href={`/bung/${item.bungId}`}>
              <BungCard
                backgroundImageUrl={item.mainImage as string}
                time={item.startDateTime}
                title={item.name}
                place={item.location}
                distance={item.distance}
                pace={item.pace}
                isBungOwner={item.hasOwnership}
              />
            </Link>
            <Spacing size={8} />
          </li>
        ))}
      </ul>
    </>
  )
}

function BungListLoadingFallback() {
  return (
    <>
      <div className='mx-auto mb-8 flex w-full max-w-[500px] justify-between'>
        <span className='text-20 font-bold text-black'>나의 벙</span>
      </div>
      {Array(3)
        .fill(null)
        .map((_, index) => (
          <Skeleton key={index} className='mb-8 h-184 w-full rounded-16 bg-gray' />
        ))}
    </>
  )
}

function BungListErrorFallback() {
  return (
    <>
      <div className='mx-auto mb-8 flex w-full max-w-[500px] justify-between'>
        <span className='text-20 font-bold text-black'>나의 벙</span>
      </div>
      <div className='mb-20'>
        <ErrorFallback type='medium' />
      </div>
    </>
  )
}

const WrappedBungList = withBoundary(BungList, {
  onLoading: <BungListLoadingFallback />,
  onError: <BungListErrorFallback />,
})
