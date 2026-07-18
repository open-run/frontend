import type { ChallengeType, CompletedChallengeWithNft } from '@apis/v1/challenges/type'
import { parseApiDateTime } from '@utils/api'
import { formatDate } from '@utils/time'
import CategoryReward from './CategoryReward'

export default function CompletedList({
  challenges,
  bottomPadding,
}: {
  challenges: CompletedChallengeWithNft[]
  bottomPadding: number
}) {
  return (
    <section
      className='scrollbar-web-hidden flex h-[calc(100%-102px)] w-full flex-col gap-8 overflow-y-auto px-16 pb-140'
      style={{ paddingBottom: bottomPadding }}>
      {challenges.length === 0 ? (
        <p className='mt-80 text-center text-14 leading-20 text-gray-darken'>아직 완료한 도전과제가 없어요</p>
      ) : (
        challenges.map((challenge) => <CompletedItem key={challenge.userChallengeId} challenge={challenge} />)
      )}
    </section>
  )
}

function CompletedItem({ challenge }: { challenge: CompletedChallengeWithNft }) {
  const nft = challenge.nft
  const completedDate = parseApiDateTime(nft?.mintedAt ?? challenge.completedDate)
  const completedAt = completedDate == null ? null : formatDate({ date: completedDate, formatStr: 'yyyy.M.d HH:mm' })
  const challengeTypeLabel = formatChallengeType(challenge.challengeType)
  const details = [normalizeText(nft?.name), completedAt].filter(isNonEmpty)

  return (
    <article className='grid w-full grid-cols-[60px_1fr_70px] place-items-center gap-8 rounded-8 bg-white px-16 py-10'>
      <CategoryReward
        categoryLabel={challengeTypeLabel}
        highlighted={challenge.challengeType === 'hidden' || challenge.challengeType === 'tuto'}
        imageSrc={normalizeText(nft?.image)}
        imageAlt={normalizeText(nft?.name) ?? challenge.challengeName}
      />
      <div className='flex w-full min-w-0 flex-col justify-start'>
        <span className='line-clamp-1 text-14 font-bold'>{challenge.challengeName}</span>
        {details.length > 0 && (
          <span className='mt-2 line-clamp-1 text-10 font-medium text-gray-darken'>{details.join(' · ')}</span>
        )}
      </div>
      <div className='flex h-40 w-70 items-center justify-center rounded-8 bg-gray text-14 font-bold text-white'>
        보상 완료
      </div>
    </article>
  )
}

function formatChallengeType(challengeType: ChallengeType) {
  switch (challengeType) {
    case 'normal':
      return '일반'
    case 'repetitive':
      return '반복'
    case 'tuto':
      return '튜토리얼'
    case 'hidden':
      return '이벤트'
  }
}

function normalizeText(value: string | null | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function isNonEmpty(value: string | null): value is string {
  return value != null
}
