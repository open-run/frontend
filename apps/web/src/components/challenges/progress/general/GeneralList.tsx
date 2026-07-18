import { useRef } from 'react'
import type { ChallengeInfo } from '@apis/v1/challenges/type'
import OverlayScrollbar from '@shared/OverlayScrollbar'
import CircularProgress, { QuestionMarkImage, RandomGiftImage } from '../CircularProgress'
import RewardStatus from '../RewardStatus'
import GeneralItem from './GeneralItem'

export default function GeneralList({ challenges, bottomPadding }: { challenges: ChallengeInfo[]; bottomPadding: number }) {
  const scrollRef = useRef<HTMLElement>(null)

  return (
    <div className='relative h-[calc(100%-102px)]'>
      <section
        ref={scrollRef}
        className='scrollbar-web-hidden flex h-full flex-col gap-8 overflow-y-auto p-16 pb-140'
        style={{ paddingBottom: bottomPadding }}>
        {challenges.map((challenge) => {
          const progressPercent = Math.round(challenge.progressStat)

          return (
            <GeneralItem
              key={challenge.userChallengeId || `challenge-${challenge.challengeId}`}
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
                  completedDate={challenge.completedDate}
                  nftCompleted={challenge.nftCompleted}
                />
              )}
            />
          )
        })}
      </section>
      <OverlayScrollbar scrollRef={scrollRef} />
    </div>
  )
}
