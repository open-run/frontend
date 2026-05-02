'use client'

import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@icons/arrow'
import { colors } from '@styles/colors'
import { ApiDateTime, NftMintJob, NftMintJobStatus } from '@apis/v1/nft/mint-jobs'
import { useStartMintJobMutation } from '@apis/v1/nft/mint-jobs/mutation'
import { useMyMintJobsQuery } from '@apis/v1/nft/mint-jobs/query'
import { formatDate } from '@utils/time'

export default function MintJobNotifications() {
  const router = useRouter()
  const { mutate: startMintJob, isPending, variables } = useStartMintJobMutation()
  const { data: mintJobs, isLoading } = useMyMintJobsQuery({
    refetchInterval: (query) => {
      const response = query.state.data

      return response?.data.some(isActiveMintJob) ? 3000 : false
    },
  })
  const jobs = mintJobs?.data ?? []

  return (
    <section className='h-full w-full bg-white'>
      <header className='relative flex h-60 items-center justify-center px-16 app:mt-50'>
        <button
          className='absolute left-12 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'
          onClick={() => router.back()}>
          <ArrowLeftIcon size={24} color={colors.black.DEFAULT} />
        </button>
        <h1 className='text-16 font-bold'>알림</h1>
      </header>

      <div className='h-[calc(100%-60px)] overflow-y-auto px-16 pb-120'>
        {isLoading ? (
          <NotificationSkeleton />
        ) : jobs.length === 0 ? (
          <div className='mt-80 text-center text-14 leading-20 text-gray-darken'>
            아직 민팅 알림이 없어요
          </div>
        ) : (
          <div className='flex flex-col gap-8'>
            {jobs.map((job) => (
              <MintJobNotificationCard
                key={job.mintJobId}
                job={job}
                isRetrying={isPending && variables?.userChallengeId === job.userChallengeId}
                onRetry={() => startMintJob({ userChallengeId: job.userChallengeId })}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function MintJobNotificationCard({
  job,
  isRetrying,
  onRetry,
}: {
  job: NftMintJob
  isRetrying: boolean
  onRetry: () => void
}) {
  const statusMeta = MINT_JOB_STATUS_META[job.status]

  return (
    <article className='rounded-8 bg-gray-lighten px-16 py-14'>
      <div className='mb-8 flex items-start justify-between gap-12'>
        <div className='min-w-0'>
          <p className='line-clamp-1 text-14 font-bold text-black-darken'>{job.challengeName}</p>
          <p className='mt-2 text-12 text-gray-darken'>
            {formatMintJobDate(job.updatedAt)}
          </p>
        </div>
        <span className={clsx('flex-shrink-0 rounded-full px-10 py-4 text-12 font-bold', statusMeta.className)}>
          {statusMeta.label}
        </span>
      </div>

      {job.status === 'SUCCESS' && (
        <p className='text-12 text-gray-darken'>
          {job.nftName ?? 'NFT'} 발급이 완료됐어요
        </p>
      )}

      {job.status === 'FAILED' && (
        <div className='flex items-end justify-between gap-12'>
          <p className='line-clamp-2 text-12 text-gray-darken'>
            {job.errorMessage ?? '발급에 실패했어요'}
          </p>
          <button
            className='h-32 flex-shrink-0 rounded-8 bg-primary px-12 text-12 font-bold text-white active-press-duration active:scale-95 active:bg-primary-darken disabled:bg-gray'
            disabled={isRetrying}
            onClick={onRetry}>
            {isRetrying ? '재시도 중' : '재시도'}
          </button>
        </div>
      )}
    </article>
  )
}

function NotificationSkeleton() {
  return (
    <div className='flex flex-col gap-8'>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className='h-82 animate-pulse rounded-8 bg-gray' />
      ))}
    </div>
  )
}

function isActiveMintJob(mintJob: NftMintJob) {
  return mintJob.status === 'PENDING' || mintJob.status === 'MINTING'
}

function formatMintJobDate(date: ApiDateTime) {
  const parsedDate = parseMintJobDate(date)

  if (parsedDate == null) {
    return '시간 정보 없음'
  }

  return formatDate({ date: parsedDate, formatStr: 'M월 d일 a h:mm' })
}

function parseMintJobDate(date: ApiDateTime) {
  if (date == null) {
    return null
  }

  if (Array.isArray(date)) {
    const [year, month, day, hour = 0, minute = 0, second = 0, nano = 0] = date

    if (year == null || month == null || day == null) {
      return null
    }

    return toValidDate(new Date(Date.UTC(year, month - 1, day, hour, minute, second, Math.floor(nano / 1_000_000))))
  }

  const trimmedDate = date.trim()

  if (trimmedDate.length === 0) {
    return null
  }

  const normalizedDate = hasTimezone(trimmedDate) ? trimmedDate : `${trimmedDate.replace(' ', 'T')}Z`

  return toValidDate(new Date(normalizedDate))
}

function hasTimezone(date: string) {
  return /(?:z|[+-]\d{2}:?\d{2})$/i.test(date)
}

function toValidDate(date: Date) {
  return Number.isNaN(date.getTime()) ? null : date
}

const MINT_JOB_STATUS_META: Record<NftMintJobStatus, { label: string; className: string }> = {
  PENDING: {
    label: '대기 중',
    className: 'bg-white text-gray-darken',
  },
  MINTING: {
    label: '발급 중',
    className: 'bg-primary text-white',
  },
  SUCCESS: {
    label: '완료',
    className: 'bg-black-darken text-white',
  },
  FAILED: {
    label: '실패',
    className: 'bg-red-500 text-white',
  },
}
