'use client'

import clsx from 'clsx'
import { useRef, useMemo } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { BottomSheet, BottomSheetRef, Dimmed } from '@shared/Modal'
import { BrokenXIcon } from '@icons/x'
import { useRepetitiveChallengeDetail } from '@apis/v1/challenges/repetitive/[challengeId]/query'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'
import RewardStatus from '../RewardStatus'
import CircularProgress, { RandomGiftImage, RepeatImage } from '../CircularProgress'

type Stage = {
  count: number
  isCompleted: boolean
  isInProgress: boolean
  currentCount: number
  currentProgress: number
  nftCompleted: boolean
  userChallengeId: number | null
  stageNumber: number
  completedDate: string | null
}

export default function RepetitiveChallengeDetail({ challengeId }: { challengeId: number }) {
  const { closeModal } = useModal()
  const sheetRef = useRef<BottomSheetRef>(null)
  const handleClose = () => sheetRef.current?.close()
  const { data: details, isLoading, error } = useRepetitiveChallengeDetail({ challengeId })
  const challenge = details?.data

  // 전체 진행 횟수 계산 (최소 한 개 이상의 currentCount가 존재)
  const totalCurrentCount = useMemo(() => {
    if (!challenge?.challengeTrees) return 0
    return Math.max(...challenge.challengeTrees.map((tree) => tree.currentCount), 0)
  }, [challenge])

  // 스테이지 배열 생성
  const stages = useMemo<Stage[]>(() => {
    if (!challenge?.challengeTrees) return []

    return challenge.challengeTrees.map((tree) => {
      // totalCurrentCount를 기준으로 완료 여부 판단
      const isCompleted = totalCurrentCount >= tree.conditionAsCount
      // 진행 중인지 판단 (완료되지 않았지만 진행 중)
      const isInProgress = !isCompleted && totalCurrentCount > 0
      // 진행률 계산: totalCurrentCount / conditionAsCount * 100 (최대 100%)
      const currentProgress = isCompleted
        ? 100
        : tree.conditionAsCount > 0
          ? Math.min((totalCurrentCount / tree.conditionAsCount) * 100, 100)
          : 0

      return {
        count: tree.conditionAsCount,
        isCompleted,
        isInProgress,
        currentCount: totalCurrentCount, // totalCurrentCount를 사용
        currentProgress,
        nftCompleted: tree.nftCompleted,
        userChallengeId: tree.userChallengeId,
        stageNumber: tree.stageNumber,
        completedDate: tree.completedDate, // 보상받기 버튼 표시를 위해 추가
      }
    })
  }, [challenge, totalCurrentCount])

  return (
    <Dimmed onClick={handleClose}>
      <BottomSheet ref={sheetRef} onClose={() => closeModal(MODAL_KEY.REPETITIVE_CHALLENGE_DETAIL)} fullSize>
        <header className='relative flex h-60 w-full items-center justify-center px-16'>
          {isLoading ? <HeaderTitleSkeleton /> : <span className='text-16 font-bold'>{challenge?.challengeName}</span>}
          <button
            className='absolute right-12 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'
            onClick={handleClose}>
            <BrokenXIcon size={24} color={colors.black.DEFAULT} />
          </button>
        </header>

        {isLoading ? (
          <>
            <DescriptionSkeleton />
            <section className='h-full bg-gray-lighten'>
              <StageProgressSkeleton />
              <RewardCardListSkeleton />
            </section>
          </>
        ) : (
          !error &&
          challenge && (
            <>
              {/* 설명 텍스트 */}
              {challenge.challengeDescription && (
                <div className='mx-16 mt-16 rounded-8 bg-gray p-12'>
                  <p className='whitespace-pre-wrap text-12 text-black-darken'>{challenge.challengeDescription}</p>
                </div>
              )}

              <section className='h-full bg-gray-lighten'>
                {/* 스테이지 진행 바 */}
                <div className='relative mb-16 mt-40 overflow-x-auto scrollbar-hide'>
                  <div className='relative flex min-w-fit items-start'>
                    {stages.map((stage, index) => {
                      const isLast = index === stages.length - 1
                      const nextStage = !isLast ? stages[index + 1] : null

                      // CircularProgress: totalCurrentCount / conditionAsCount * 100
                      const progressPercent = stage.currentProgress

                      // 진행 바 계산: 전체 진행 횟수에 따라 스테이지 사이의 바를 칠함
                      let barProgressPercent = 0
                      let barColor = 'bg-gray'

                      if (!isLast && nextStage) {
                        const currentStageCount = stage.count
                        const nextStageCount = nextStage.count

                        // 현재 스테이지가 완료되었는지 확인
                        const isCurrentStageCompleted = totalCurrentCount >= currentStageCount

                        if (isCurrentStageCompleted && totalCurrentCount < nextStageCount) {
                          // 현재 스테이지와 다음 스테이지 사이를 진행 중
                          const progressInBetween =
                            (totalCurrentCount - currentStageCount) / (nextStageCount - currentStageCount)
                          barProgressPercent = Math.min(progressInBetween * 100, 100)
                          barColor = 'bg-primary'
                        } else if (totalCurrentCount >= nextStageCount) {
                          // 다음 스테이지까지 완료
                          barProgressPercent = 100
                          barColor = 'bg-primary'
                        }
                      }

                      return (
                        <div key={index} className='relative flex w-[120px] flex-shrink-0 flex-col items-center'>
                          {/* 원형 아이콘 */}
                          <div className='relative mb-8'>
                            <CircularProgress progress={progressPercent} total={100} circleColor='gray'>
                              {stage.isCompleted ? <RandomGiftImage /> : <RepeatImage />}
                            </CircularProgress>
                          </div>

                          {/* 진행 바 */}
                          {!isLast && (
                            <div className='absolute left-[calc(50%+34px)] top-[30px] h-4 w-[50px]'>
                              <div className='h-full w-full rounded-full bg-gray'>
                                <div
                                  className={clsx('h-full rounded-full transition-all duration-300', barColor)}
                                  style={{ width: `${barProgressPercent}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* 스테이지 횟수 텍스트 */}
                          <span
                            className={clsx(
                              'text-12',
                              stage.isCompleted && 'font-bold text-black-darken',
                              !stage.isCompleted && 'font-regular text-gray-darker',
                            )}>
                            {stage.count}회
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 보상 카드 리스트 */}
                <div className='relative h-[calc(100%-336px)] overflow-y-auto'>
                  <div className='flex flex-col gap-8 px-16 pt-20'>
                    {stages.map((stage, index) => {
                      const isCompleted = stage.isCompleted
                      const isInProgress = stage.isInProgress
                      const currentProgress = stage.currentCount
                      const targetCount = stage.count

                      return (
                        <div
                          key={index}
                          className={clsx(
                            'relative flex h-80 items-center gap-16 rounded-8 bg-white px-16 py-10',
                            isCompleted && 'shadow-floating-primary',
                            !isCompleted && !isInProgress && 'opacity-30',
                          )}>
                          {/* 원형 아이콘 */}
                          <div className='flex-shrink-0'>
                            <CircularProgress progress={stage.currentProgress} total={100}>
                              {isCompleted ? <RandomGiftImage /> : <RepeatImage />}
                            </CircularProgress>
                          </div>

                          {/* 스테이지 이름 */}
                          <p className='flex-1 whitespace-pre-wrap text-14 font-bold text-black-darken'>
                            {(() => {
                              // challengeName에서 숫자와 "회"를 제거하고 스테이지 횟수 추가
                              const baseName = challenge.challengeName.replace(/\d+회\s*/, '').trim()
                              return `${baseName} ${stage.count}회`
                            })()}
                          </p>

                          {/* 보상 상태 */}
                          <div className='flex-shrink-0'>
                            <RewardStatus
                              progress={currentProgress}
                              total={targetCount}
                              userChallengeId={stage.userChallengeId}
                              nftCompleted={stage.nftCompleted}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {/* 하단 그라데이션 blur 효과 */}
                  <div className='pointer-events-none sticky bottom-0 h-100 bg-gradient-to-b from-transparent via-gray-lighten/80 to-gray-lighten' />
                </div>
              </section>
            </>
          )
        )}
      </BottomSheet>
    </Dimmed>
  )
}

// 스켈레톤 컴포넌트들
function HeaderTitleSkeleton() {
  return <div className='h-19 w-120 animate-pulse rounded-10 bg-gray' />
}

function DescriptionSkeleton() {
  return <div className='mx-16 mt-16 h-60 animate-pulse rounded-10 bg-gray' />
}

function StageProgressSkeleton() {
  return (
    <div className='relative mb-16 mt-40 overflow-x-auto scrollbar-hide'>
      <div className='relative flex min-w-fit items-start'>
        {[0, 1, 2].map((index) => {
          const isLast = index === 2
          return (
            <div key={index} className='relative flex w-[120px] flex-shrink-0 flex-col items-center'>
              {/* 원형 아이콘 스켈레톤 */}
              <div className='relative mb-8'>
                <div className='h-60 w-60 animate-pulse rounded-full bg-gray' />
              </div>

              {/* 진행 바 스켈레톤 */}
              {!isLast && (
                <div className='absolute left-[calc(50%+34px)] top-[30px] h-4 w-[50px]'>
                  <div className='h-full w-full rounded-full bg-gray' />
                </div>
              )}

              {/* 스테이지 횟수 텍스트 스켈레톤 */}
              <div className='h-14 w-30 animate-pulse rounded-10 bg-gray' />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RewardCardListSkeleton() {
  return (
    <div className='relative h-[calc(100%-336px)] overflow-y-auto'>
      <div className='flex flex-col gap-8 px-16 pt-20'>
        {[0, 1, 2].map((index) => (
          <div key={index} className='flex h-80 items-center gap-16 rounded-8 bg-white px-16 py-10'>
            {/* 원형 아이콘 스켈레톤 */}
            <div className='flex-shrink-0'>
              <div className='h-60 w-60 animate-pulse rounded-full bg-gray' />
            </div>

            {/* 스테이지 이름 스켈레톤 */}
            <div className='flex-1'>
              <div className='h-16 w-120 animate-pulse rounded-10 bg-gray' />
            </div>

            {/* 보상 상태 스켈레톤 */}
            <div className='flex-shrink-0'>
              <div className='h-40 w-70 animate-pulse rounded-10 bg-gray' />
            </div>
          </div>
        ))}
      </div>
      {/* 하단 그라데이션 blur 효과 */}
      <div className='pointer-events-none sticky bottom-0 h-100 bg-gradient-to-b from-transparent via-gray-lighten/80 to-gray-lighten' />
    </div>
  )
}
