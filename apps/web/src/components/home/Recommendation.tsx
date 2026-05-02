import Image from 'next/image'
import Link from 'next/link'
import ErrorFallback from '@shared/ErrorFallback'
import Skeleton from '@shared/Skeleton'
import withBoundary from '@shared/withBoundary'
import { useBungsQuery } from '@apis/v1/bungs/query'
import RecommendationCard from './RecommendationCard'

export default function Recommendation() {
  return (
    <section className='flex flex-col px-16 pb-60'>
      <div className='mx-auto mb-8 flex w-full max-w-[500px] items-center justify-between'>
        <span className='text-20 font-bold text-black'>추천</span>
      </div>
      <WrappedRecommendationBungs />
    </section>
  )
}

function RecommendationBungs() {
  const { data: recommendationList } = useBungsQuery({
    isAvailableOnly: true,
    page: 0,
    limit: 10,
  })

  return (
    <section className='flex flex-col gap-8'>
      {recommendationList?.data.map((bung) => (
        <Link key={bung.bungId} className='text-start' href={`/bung/${bung.bungId}`}>
          <RecommendationCard
            backgroundImageUrl={bung.mainImage as string}
            title={bung.name}
            location={bung.location}
            time={bung.startDateTime}
            remainingCount={bung.memberNumber - bung.memberList.length}
            hashtags={bung.hashtags}
            participantImageUrls={bung.memberList.map((member) => member.profileImageUrl)}
          />
        </Link>
      ))}
      {recommendationList?.data.length === 0 && (
        <div className='mt-32 flex h-full w-full flex-col items-center justify-center gap-8'>
          <Image src='/images/home/skewed_x_button.png' alt='기울어진 X 버튼 이미지' width={56} height={56} />
          <p className='text-center text-14 text-gray-darken'>
            현재 열린 벙이 없어요 <br />
            새로운 벙을 만들어 멤버를 모집해 보세요!
          </p>
        </div>
      )}
    </section>
  )
}

function RecommendationLoadingFallback() {
  return (
    <section className='flex flex-col gap-8'>
      {Array(2)
        .fill(null)
        .map((_, index) => (
          <Skeleton key={index} className='mb-8 h-184 w-full rounded-16 bg-gray' />
        ))}
    </section>
  )
}

function RecommendationErrorFallback() {
  return (
    <section className='h-200 w-full'>
      <ErrorFallback type='medium' />
    </section>
  )
}

const WrappedRecommendationBungs = withBoundary(RecommendationBungs, {
  onLoading: <RecommendationLoadingFallback />,
  onError: <RecommendationErrorFallback />,
})
