import ErrorFallback from '@shared/ErrorFallback'
import withBoundary from '@shared/withBoundary'
import { ArrowRightIcon } from '@icons/arrow'
import { fetchRepetitiveChallengeList } from '@apis/v1/challenges/repetitive'
import { ChallengeInfo } from '@apis/v1/challenges/type'
import { colors } from '@styles/colors'
import CircularProgress, { RandomGiftImage, RepeatImage } from '../CircularProgress'
import RewardStatus from '../RewardStatus'
import RepetitiveItem from './RepetitiveItem'

async function RepetitiveList() {
  const response = await fetchRepetitiveChallengeList()
  const challenges: ChallengeInfo[] = Array.isArray(response.data) ? response.data : [response.data]

  return (
    <section className='flex h-[calc(100%-102px)] flex-col gap-8 overflow-y-auto p-16 pb-120'>
      {challenges.map((challenge) => {
        const progressPercent = Math.round(challenge.progressStat)

        return (
          <RepetitiveItem key={challenge.userChallengeId} challengeId={challenge.challengeId}>
            <CircularProgress progress={progressPercent} total={100}>
              {progressPercent !== 100 ? <RepeatImage /> : <RandomGiftImage />}
            </CircularProgress>
            <p className='flex w-full items-center justify-between gap-8 justify-self-start text-left text-14 font-bold'>
              {challenge.challengeName}
            </p>
            <div className='flex items-center gap-4'>
              <RewardStatus
                progress={challenge.currentCount}
                total={challenge.conditionCount}
                userChallengeId={challenge.userChallengeId}
                nftCompleted={challenge.nftCompleted}
              />
              <ArrowRightIcon size={16} color={colors.black.darkest} />
            </div>
          </RepetitiveItem>
        )
      })}
    </section>
  )
}

export default withBoundary(RepetitiveList, {
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
