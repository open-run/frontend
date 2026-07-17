'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { Rarity } from '@type/avatar'
import RarityBadge from '@components/avatar/shared/RarityBadge'
import PushTransitionLink from '@shared/PushTransitionLink'
import ToastModal from '@shared/ToastModal'
import type { NftMintJob } from '@apis/v1/nft/mint-jobs'
import { useStartMintJobMutation } from '@apis/v1/nft/mint-jobs/mutation'
import { MODAL_KEY } from '@constants/modal'
import RandomRewardRoulette from './RandomRewardRoulette'
import { MAX_MINT_JOB_ATTEMPTS, getRewardClaimAttemptDecision, hasCompleteRewardPayload } from './rewardClaimFlow'

const CHALLENGES_PROGRESS_PATH = '/challenges?list=progress'
const REWARD_CLAIM_FALLBACK_MESSAGE = '잠시 후 다시 시도해 주세요'

const ROULETTE_MIN_LOOP_DURATION_MS = 1400
const ROULETTE_SETTLE_DURATION_SECONDS = 2.4
const PENDING_RETRY_DELAY_MS = 1000
const MINT_JOB_RESPONSE_TIMEOUT_MS = 8000

type RewardClaimPageProps = {
  userChallengeId: number
}

export default function RewardClaimPage({ userChallengeId }: RewardClaimPageProps) {
  const router = useRouter()
  const { showModal } = useModal()
  const { mutateAsync: startMintJob } = useStartMintJobMutation()
  const [mintJob, setMintJob] = useState<NftMintJob | null>(null)
  const [isRewardRevealVisible, setIsRewardRevealVisible] = useState(false)
  const startMintJobRef = useRef(startMintJob)
  const mintRequestRef = useRef<{
    userChallengeId: number
    promise: ReturnType<typeof startMintJob>
  } | null>(null)
  const attemptCountRef = useRef(0)

  useEffect(() => {
    startMintJobRef.current = startMintJob
  }, [startMintJob])

  const handleRouletteRevealComplete = useCallback(() => {
    setIsRewardRevealVisible(true)
  }, [])

  const fallbackToChallenges = useCallback(() => {
    showModal({
      key: MODAL_KEY.TOAST,
      component: <ToastModal mode='error' message={REWARD_CLAIM_FALLBACK_MESSAGE} />,
    })
    router.replace(CHALLENGES_PROGRESS_PATH)
  }, [router, showModal])

  useEffect(() => {
    attemptCountRef.current = 0
    setMintJob(null)
    setIsRewardRevealVisible(false)

    let isActive = true
    let settleTimerId: number | null = null
    let retryTimerId: number | null = null
    const requestedAt = Date.now()

    const handleFallback = () => {
      if (!isActive) return
      fallbackToChallenges()
    }

    const getMintRequest = () => {
      const currentRequest = mintRequestRef.current

      if (currentRequest?.userChallengeId === userChallengeId) {
        return currentRequest.promise
      }

      const abortController = new AbortController()
      const timeoutTimerId = window.setTimeout(() => {
        abortController.abort()
      }, MINT_JOB_RESPONSE_TIMEOUT_MS)
      const promise = startMintJobRef.current({ userChallengeId, signal: abortController.signal })
      const nextRequest = { userChallengeId, promise }
      mintRequestRef.current = nextRequest

      void promise
        .finally(() => {
          window.clearTimeout(timeoutTimerId)
          if (mintRequestRef.current === nextRequest) {
            mintRequestRef.current = null
          }
        })
        .catch(() => undefined)

      return promise
    }

    const scheduleRetry = () => {
      if (retryTimerId != null) {
        window.clearTimeout(retryTimerId)
      }

      retryTimerId = window.setTimeout(() => {
        if (!isActive) return
        void requestMint()
      }, PENDING_RETRY_DELAY_MS)
    }

    const scheduleRouletteSettle = async (job: NftMintJob) => {
      const elapsedMs = Date.now() - requestedAt
      const delayMs = Math.max(ROULETTE_MIN_LOOP_DURATION_MS - elapsedMs, 0)

      if (settleTimerId != null) {
        window.clearTimeout(settleTimerId)
      }

      const waitForMinimumLoop = new Promise<void>((resolve) => {
        if (delayMs === 0) {
          resolve()
          return
        }

        settleTimerId = window.setTimeout(resolve, delayMs)
      })

      await Promise.all([waitForMinimumLoop, preloadRewardImage(job.nftImage!)])
      if (!isActive) return

      setIsRewardRevealVisible(false)
      setMintJob(job)
    }

    const requestMint = async () => {
      attemptCountRef.current += 1
      const attempt = attemptCountRef.current

      try {
        const response = await getMintRequest()
        if (!isActive) return

        const job = response.data
        const decision = getRewardClaimAttemptDecision({
          attempt,
          status: job.status,
          hasRewardPayload: hasCompleteRewardPayload(job),
        })

        if (decision === 'reveal') {
          await scheduleRouletteSettle(job)
          return
        }

        if (decision === 'retry') {
          mintRequestRef.current = null
          scheduleRetry()
          return
        }

        handleFallback()
      } catch {
        if (!isActive) return

        if (mintRequestRef.current?.userChallengeId === userChallengeId) {
          mintRequestRef.current = null
        }

        const decision = getRewardClaimAttemptDecision({
          attempt,
          status: null,
          hasRewardPayload: false,
        })

        if (decision === 'retry') {
          scheduleRetry()
          return
        }

        handleFallback()
      }
    }

    void requestMint()

    return () => {
      isActive = false
      if (settleTimerId != null) {
        window.clearTimeout(settleTimerId)
      }
      if (retryTimerId != null) {
        window.clearTimeout(retryTimerId)
      }
    }
  }, [fallbackToChallenges, userChallengeId])

  return (
    <section className='relative h-full w-full overflow-hidden'>
      {/* 보상 획득 화면과 동일한 배경: 파란색 + 하단 흰색 그라데이션 */}
      <div className='bg-primary absolute inset-0' />
      <div className='absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-b from-transparent to-white' />

      <motion.div
        className='relative flex h-full w-full flex-col items-center'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <AnimatePresence mode='wait'>
          <motion.h1
            key={isRewardRevealVisible ? 'revealed' : 'claiming'}
            className='font-jost text-28 mt-[105px] font-black text-white'
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            {isRewardRevealVisible ? '신규 획득!' : '보상 발급 중'}
          </motion.h1>
        </AnimatePresence>

        <div className='mt-40 flex flex-col items-center'>
          <div className='w-168 relative flex aspect-square items-center justify-center'>
            <RandomRewardRoulette
              winningImageSrc={mintJob?.nftImage ?? null}
              spinDuration={ROULETTE_SETTLE_DURATION_SECONDS}
              onRevealComplete={handleRouletteRevealComplete}
            />
          </div>

          <AnimatePresence>
            {isRewardRevealVisible && mintJob != null && (
              <motion.div
                className='flex flex-col items-center'
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 6, opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <RarityBadge rarity={mintJob.nftRarity as Rarity} className='mt-16' />
                <h4 className='text-20 mt-8 text-center font-bold text-white'>{mintJob.nftName}</h4>
                <span className='text-16 mt-4 text-white'>{mintJob.nftCategory}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isRewardRevealVisible && mintJob != null && (
          <motion.div
            className='absolute bottom-40 left-16 right-16 flex flex-col gap-12'
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.28, ease: 'easeOut' }}
          >
            <button
              className='rounded-8 active-press-duration active:scale-98 active:bg-gray-lighten flex h-56 w-full items-center justify-center bg-white'
              onClick={() => router.replace(CHALLENGES_PROGRESS_PATH)}
            >
              <span className='text-16 text-black-darken font-bold'>확인</span>
            </button>

            <PushTransitionLink href='/avatar' replace>
              <button className='rounded-8 bg-primary active-press-duration active:scale-98 active:bg-primary-darken flex h-56 w-full items-center justify-center'>
                <span className='text-16 font-bold text-white'>아바타 꾸미러 가기</span>
              </button>
            </PushTransitionLink>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}

async function preloadRewardImage(src: string): Promise<void> {
  if (typeof window === 'undefined') return

  const image = new window.Image()
  ;(image as HTMLImageElement & { fetchPriority?: 'high' | 'low' | 'auto' }).fetchPriority = 'high'
  image.decoding = 'async'

  await new Promise<void>((resolve) => {
    image.onload = () => resolve()
    image.onerror = () => resolve()
    image.src = src

    if (image.complete) {
      resolve()
    }
  })

  try {
    await image.decode()
  } catch {
    // 이미지 decode 실패가 룰렛을 영구 대기시키면 안 된다.
  }
}
