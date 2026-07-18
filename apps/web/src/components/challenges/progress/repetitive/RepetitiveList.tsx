import { ArrowRightIcon } from '@icons/arrow'
import type { ChallengeInfo } from '@apis/v1/challenges/type'
import { colors } from '@styles/colors'
import CircularProgress, { RandomGiftImage, RepeatImage } from '../CircularProgress'
import RewardStatus from '../RewardStatus'
import RepetitiveItem from './RepetitiveItem'

export default function RepetitiveList({ challenges, bottomPadding }: { challenges: ChallengeInfo[]; bottomPadding: number }) {
  return (
    <section
      className='scrollbar-web-hidden flex h-[calc(100%-102px)] flex-col gap-8 overflow-y-auto p-16 pb-140'
      style={{ paddingBottom: bottomPadding }}>
      {challenges.map((challenge) => {
        const progressPercent = Math.round(challenge.progressStat)

        return (
          <RepetitiveItem
            key={challenge.userChallengeId || `challenge-${challenge.challengeId}`}
            challengeId={challenge.challengeId}
          >
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
                completedDate={challenge.completedDate}
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
