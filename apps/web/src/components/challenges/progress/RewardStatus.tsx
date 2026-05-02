'use client'

import { useStartMintJobMutation } from '@apis/v1/nft/mint-jobs/mutation'
import { useMyMintJobsQuery } from '@apis/v1/nft/mint-jobs/query'

type RewardStatusProps = {
  progress: number
  total: number
  userChallengeId: number | null
  nftCompleted?: boolean
}

export default function RewardStatus({
  progress,
  total,
  userChallengeId,
  nftCompleted = false,
}: RewardStatusProps) {
  const { data: mintJobs } = useMyMintJobsQuery()
  const { mutate: startMintJob, isPending, variables } = useStartMintJobMutation()
  const mintJob = mintJobs?.data.find((job) => job.userChallengeId === userChallengeId)
  const isStarting = isPending && variables?.userChallengeId === userChallengeId
  const isMinting = isStarting || mintJob?.status === 'PENDING' || mintJob?.status === 'MINTING'
  const isFailed = mintJob?.status === 'FAILED'
  const isCompleted = nftCompleted || mintJob?.status === 'SUCCESS'

  if (progress < total) {
    return (
      <div className='flex h-40 w-70 items-center justify-center rounded-8 bg-gray-lighten'>
        <span className='text-14 text-gray-darken'>
          <span className='font-bold text-primary'>{progress}</span>/{total}
        </span>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className='flex h-40 w-70 items-center justify-center rounded-8 bg-gray-lighten'>
        <span className='text-14 font-bold text-gray-darken'>완료</span>
      </div>
    )
  }

  if (userChallengeId == null) {
    return (
      <div className='flex h-40 w-70 items-center justify-center rounded-8 bg-gray-lighten'>
        <span className='text-14 text-gray-darken'>대기</span>
      </div>
    )
  }

  return (
    <button
      className='h-40 w-70 rounded-8 bg-primary active-press-duration active:scale-98 active:bg-primary-darken disabled:bg-gray'
      disabled={isMinting}
      onClick={(event) => {
        event.stopPropagation()
        startMintJob({ userChallengeId })
      }}>
      <span className='text-14 font-bold text-white'>{isMinting ? '발급 중' : isFailed ? '재시도' : '보상 받기'}</span>
    </button>
  )
}
