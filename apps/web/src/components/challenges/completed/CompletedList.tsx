import ErrorFallback from '@shared/ErrorFallback'
import withBoundary from '@shared/withBoundary'
import { fetchCompletedChallengeList } from '@apis/v1/challenges/completed'
import CategoryReward from './CategoryReward'

async function CompletedList() {
  // await fetchCompletedChallengeList()

  return (
    <section className='w-full px-16'>
      <article className='grid w-full grid-cols-[60px_1fr_70px] place-items-center gap-8 rounded-8 bg-white px-16 py-10'>
        <CategoryReward category='event' />
        <div className='flex w-full flex-col justify-start'>
          <span className='text-14 font-bold'>벙 3회 참여</span>
          <span className='text-10 font-medium'>완료 시각: 2024.12.25 21:00</span>
        </div>
        <div className='flex h-40 w-70 items-center justify-center rounded-8 bg-gray text-14 font-bold text-white'>
          보상 완료
        </div>
      </article>
    </section>
  )
}

export default withBoundary(CompletedList, {
  onLoading: (
    <section className='flex flex-col gap-8 p-16'>
      <div className='h-80 w-full animate-pulse rounded bg-gray' />
      <div className='h-80 w-full animate-pulse rounded bg-gray' />
      <div className='h-80 w-full animate-pulse rounded bg-gray' />
    </section>
  ),
  onError: (
    <section className='pt-60'>
      <ErrorFallback type='medium' />
    </section>
  ),
})
