import ErrorFallback from '@shared/ErrorFallback'
import withBoundary from '@shared/withBoundary'
import { fetchGeneralChallengeList } from '@apis/v1/challenges/general'
import CircularProgress, { QuestionMarkImage, RandomGiftImage } from '../CircularProgress'
import RewardStatus from '../RewardStatus'
import GeneralItem from './GeneralItem'

async function GeneralList() {
  const response = await fetchGeneralChallengeList()
  const challenges = Array.isArray(response.data) ? response.data : [response.data]

  return (
    <section className='flex h-[calc(100%-102px)] flex-col gap-8 overflow-y-auto p-16 pb-120'>
      {challenges.map((challenge) => {
        const progressPercent = Math.round(challenge.progressStat)

        return (
          <GeneralItem
            key={challenge.userChallengeId}
            progressNode={
              <CircularProgress progress={progressPercent} total={100}>
                {progressPercent !== 100 ? <QuestionMarkImage /> : <RandomGiftImage />}
              </CircularProgress>
            }
            title={challenge.challengeName}
            description={challenge.challengeDescription}
            rewardStatusNode={(
              <RewardStatus
                progress={challenge.currentCount}
                total={challenge.conditionCount}
                userChallengeId={challenge.userChallengeId}
                nftCompleted={challenge.nftCompleted}
              />
            )}
          />
        )
      })}
    </section>
  )
}

export default withBoundary(GeneralList, {
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
