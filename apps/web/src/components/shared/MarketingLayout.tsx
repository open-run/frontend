'use client'

import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import LoadingLogo from '@components/shared/LoadingLogo'
import { BackgroundOpenrunIcon } from '@icons/openrun'
import { colors } from '@styles/colors'

export default function MarketingLayout() {
  const containerRef = useRef<HTMLDivElement>(null)
  // SSR/초기 HTML에서는 window 없음 → iframe src=""로 나가 onLoad가 안정적으로 안 뜨는 경우 방지.
  // 클라이언트 마운트 후에만 URL을 넣어 iframe을 한 번에 올바른 src로 마운트.
  const [iframeUrl, setIframeUrl] = useState<string | null>(null)
  useEffect(() => {
    setIframeUrl(window.location.href.replace(/\/+$/, ''))
  }, [])

  // 고정 크기 설정 - iPhone 15 Pro Max 크기와 동일
  const MOCKUP_WIDTH = 430 // iPhone 15 Pro Max 너비
  const SCREEN_RATIO = 0.84 // 베젤을 제외한 화면 영역 비율
  const IPHONE_WIDTH = 430 // iPhone 15 Pro Max 너비

  const screenWidth = MOCKUP_WIDTH * SCREEN_RATIO
  const scale = screenWidth / IPHONE_WIDTH

  const [mockupY, setMockupY] = useState('100%')
  const [isIframeLoaded, setIsIframeLoaded] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isMockupAnimating, setIsMockupAnimating] = useState(false)
  const [canClickToReveal, setCanClickToReveal] = useState(false) // 30%까지 올라온 뒤에만 클릭 허용
  const hasClickedRef = useRef(false)
  const mockupDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleIframeLoad = useCallback(() => {
    setIsIframeLoaded(true)
    // 로딩 로고 exit(0.3s)가 끝난 뒤 목업이 올라오도록 지연 → 동시 애니메이션으로 인한 끊김 방지
    setIsMockupAnimating(true)
    mockupDelayRef.current = setTimeout(() => {
      setMockupY('30%')
      mockupDelayRef.current = null
    }, 320)
  }, [])

  useEffect(() => {
    return () => {
      if (mockupDelayRef.current) clearTimeout(mockupDelayRef.current)
    }
  }, [])

  const handleBackgroundClick = () => {
    if (!canClickToReveal) return // 로딩 끝나고 목업이 30%까지 올라온 뒤에만 동작
    hasClickedRef.current = true
    setCanClickToReveal(false) // 바운스 애니메이션 중단
    setIsMockupAnimating(true)
    setMockupY('0%')
  }

  const handleMockupAnimationComplete = useCallback(() => {
    setIsMockupAnimating(false)
    if (mockupY === '30%') setCanClickToReveal(true)
    if (hasClickedRef.current) setIsRevealed(true)
  }, [mockupY])

  const BG_IMAGE = '/images/marketing/bg_custom_gradient.png'

  // 페이지 진입 시 커스텀 배경 이미지 미리 다운로드 (클릭 후 전환 시 즉시 표시)
  useEffect(() => {
    const img = new window.Image()
    img.src = BG_IMAGE
  }, [BG_IMAGE])

  const bgTransition = { duration: 1.2, ease: [0.4, 0, 0.2, 1] }

  return (
    <div
      ref={containerRef}
      className='relative z-0 flex h-full w-full flex-col items-center'>
      {/* 1) 첫 번째 배경(그라데이션): 두 번째 등장 시 서서히 사라짐 */}
      <motion.div
        className='absolute inset-0 z-0 bg-gradient-primary-white'
        initial={false}
        animate={{ opacity: isRevealed ? 0 : 1 }}
        transition={bgTransition}
        aria-hidden
      />
      {/* 2) 두 번째 배경(커스텀 이미지): 서서히 등장 — 그라데이션과 크로스페이드로 번쩍임 방지 */}
      <motion.div
        className='absolute inset-0 z-0'
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        initial={false}
        animate={{ opacity: isRevealed ? 1 : 0 }}
        transition={bgTransition}
        aria-hidden
      />

      {/* 로고·텍스트: 배경 전환과 같은 타이밍으로 서서히 사라짐 */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div
            className='absolute mx-auto flex w-[65%] -translate-y-[25%] max-[575px]:hidden'
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={bgTransition}>
            <BackgroundOpenrunIcon color={colors.white} className='h-auto w-full opacity-5' />
            <div className='absolute bottom-1/2 left-1/2 flex -translate-x-1/2 translate-y-1/2 flex-col items-center justify-center gap-20'>
              <div className='relative h-[86px] w-[180px]'>
                <Image
                  src='/images/marketing/img_logo.png'
                  alt='OpenRun Logo'
                  fill
                  className='object-contain'
                  priority
                />
              </div>
              <div className='flex flex-col items-center text-center'>
                <p className='text-16 font-bold text-secondary'>함께 달리고 NFT 아바타로 나를 표현하는</p>
                <p className='text-24 font-black italic text-white'>커뮤니티 기반 러닝 M2E</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 두 번째 배경 등장 시: 화면 윗부분 양끝에 로고(좌) + 텍스트(우) — Figma 10857-2937 */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            className='absolute left-80 right-80 top-40 z-10 flex items-start justify-between max-[575px]:hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={bgTransition}>
            <div className='relative h-48 w-100 shrink-0'>
              <Image
                src='/images/marketing/img_logo.png'
                alt='OpenRun Logo'
                fill
                className='object-contain object-left-top'
              />
            </div>
            <div className='flex flex-col items-end text-right'>
              <p className='text-12 font-bold text-secondary'>함께 달리고 NFT 아바타로 나를 표현하는</p>
              <p className='text-16 font-black italic text-white'>커뮤니티 기반 러닝 M2E</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iframe 로드 전: 로딩 화면(LoadingLogo) 표시 */}
      <AnimatePresence>
        {!isIframeLoaded && (
          <motion.div
            className='absolute inset-0 z-10 flex items-center justify-center'
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <LoadingLogo className='text-white' />
          </motion.div>
        )}
      </AnimatePresence>

      {/* iPhone Mockup - iframe 로드 후 30%까지 올라옴, 클릭 시 0%로 (GPU 레이어·paint containment으로 버벅임 최소화) */}
      {/* 30% 도달 후 바운스 반복으로 클릭 유도 */}
      <motion.div
        className={clsx(
          'absolute z-20',
          canClickToReveal && !isRevealed && 'cursor-pointer transition-[filter] duration-300 hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]',
        )}
        onClick={handleBackgroundClick}
        initial={{ y: '100%' }}
        animate={canClickToReveal && !isRevealed ? { y: ['30%', '28%', '30%'] } : { y: mockupY }}
        transition={
          canClickToReveal && !isRevealed
            ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
            : { type: 'tween', duration: mockupY === '0%' ? 0.5 : 0.7, ease: [0.25, 0.1, 0.25, 1] }
        }
        onAnimationComplete={handleMockupAnimationComplete}
        style={{
          height: '100vh',
          aspectRatio: '430/932',
          willChange: isMockupAnimating ? 'transform' : 'auto',
          contain: 'layout paint',
          backfaceVisibility: 'hidden' as const,
        }}>
        <Image
          src='/images/marketing/img_mockup_iphone.png'
          alt='iPhone Mockup'
          fill
          className='object-contain'
          priority
        />

        {/* iframe으로 실제 서비스 화면 표시 - 목업의 화면 영역에 정확히 맞춤 (클라이언트 전용 URL로만 마운트) */}
        <div
          className='absolute overflow-hidden'
          style={{
            top: '7.85%',
            left: '7.9%',
            contain: 'layout paint',
          }}>
          {iframeUrl && (
            <iframe
              src={iframeUrl}
              className='rounded-[50px] border-0'
              title='OpenRun App Preview'
              onLoad={handleIframeLoad}
              style={{
                aspectRatio: '432/932',
                height: '100vh',
                transform: `scale(${scale * 1.0})`,
                transformOrigin: 'top left',
              }}
            />
          )}

          {/* reveal 전: iframe 위 투명 오버레이로 클릭 가로채기 / reveal 후: 제거하여 iframe 조작 허용 */}
          {!isRevealed && <div className='absolute inset-0 z-10' />}
        </div>
      </motion.div>
    </div>
  )
}
