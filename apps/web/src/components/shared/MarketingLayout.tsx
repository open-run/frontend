'use client'

import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import LoadingLogo from '@components/shared/LoadingLogo'
import { ROOT_PORTAL_ID } from '@constants/layout'
import { BackgroundOpenrunIcon } from '@icons/openrun'
import { colors } from '@styles/colors'

// 기존에는 iframe 로드를 기다려 mockup이 등장했지만, 단일 React 트리로 옮기면 children mount가 즉시라
// LoadingLogo가 시각적으로 보이지 않을 수 있다. 기존 UX 톤을 보존하기 위해 의도된 짧은 지연을 둔다.
const APP_READY_DELAY_MS = 250

// 같은 브라우저 세션 안에서 mockup을 한 번 reveal 했는지 기록하는 sessionStorage 키.
// OAuth redirect 복귀나 새로고침 시 처음부터 다시 100% → 30% 슬라이드를 거치지 않도록
// 이미 reveal한 세션에서는 즉시 0% 가운데 위치 + reveal 상태로 시작한다.
const REVEALED_KEY = 'openrun:marketing-revealed'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  // 고정 크기 설정 - iPhone 15 Pro Max 크기와 동일
  const MOCKUP_WIDTH = 430 // iPhone 15 Pro Max 너비
  const SCREEN_RATIO = 0.84 // 베젤을 제외한 화면 영역 비율
  const IPHONE_WIDTH = 430 // iPhone 15 Pro Max 너비

  const screenWidth = MOCKUP_WIDTH * SCREEN_RATIO
  const scale = screenWidth / IPHONE_WIDTH

  const [mockupY, setMockupY] = useState('100%')
  const [isAppReady, setIsAppReady] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isMockupAnimating, setIsMockupAnimating] = useState(false)
  const [canClickToReveal, setCanClickToReveal] = useState(false) // 30%까지 올라온 뒤에만 클릭 허용
  const [transitionEnabled, setTransitionEnabled] = useState(true) // 재방문 시 즉시 jump를 위해 일시 false로
  const hasClickedRef = useRef(false)
  const mockupDelayRef = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false

    // 같은 세션에서 이미 reveal한 경우: 100% → 30% → 0% 흐름을 건너뛰고 즉시 가운데 + reveal 상태로 시작.
    // CSS transition을 잠시 비활성화 → mockupY/isRevealed 동시 변경 → 슬라이드 애니메이션 없이 즉시 점프.
    if (window.sessionStorage.getItem(REVEALED_KEY) === 'true') {
      setTransitionEnabled(false)
      setIsAppReady(true)
      setMockupY('0%')
      setIsRevealed(true)
      // 다음 paint cycle 후 transition 재활성 (이후 추가 동작은 없지만 안전 차원)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (!cancelled) setTransitionEnabled(true)
        }),
      )
      return () => {
        cancelled = true
      }
    }

    const readyTimer = window.setTimeout(() => {
      if (cancelled) return
      setIsAppReady(true)
      setIsMockupAnimating(true)
      // 로딩 로고 exit(0.3s)가 끝난 뒤 목업이 올라오도록 지연 → 동시 애니메이션으로 인한 끊김 방지
      mockupDelayRef.current = window.setTimeout(() => {
        if (cancelled) return
        setMockupY('30%')
        mockupDelayRef.current = null
      }, 320)
    }, APP_READY_DELAY_MS)

    return () => {
      cancelled = true
      window.clearTimeout(readyTimer)
      if (mockupDelayRef.current != null) window.clearTimeout(mockupDelayRef.current)
    }
  }, [])

  const handleBackgroundClick = () => {
    if (!canClickToReveal) return // 로딩 끝나고 목업이 30%까지 올라온 뒤에만 동작
    hasClickedRef.current = true
    setCanClickToReveal(false) // 바운스 애니메이션 중단
    setIsMockupAnimating(true)
    setMockupY('0%')
    // 같은 세션의 새로고침/redirect 복귀 시 다시 0% 상태로 시작하도록 기록
    window.sessionStorage.setItem(REVEALED_KEY, 'true')
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

      {/* 앱 mount 직후의 짧은 페이크 로딩(LoadingLogo) — iframe load 대기 UX와 동일 톤 */}
      <AnimatePresence>
        {!isAppReady && (
          <motion.div
            className='absolute inset-0 z-10 flex items-center justify-center'
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <LoadingLogo className='text-white' />
          </motion.div>
        )}
      </AnimatePresence>

      {/* iPhone Mockup — vanilla CSS transform/transition으로 슬라이드 (framer-motion percentage transform과의
          상호작용 이슈 회피). 100% → 30% 슬라이드 인, 클릭 시 30% → 0% 슬라이드 업. */}
      <div
        className={clsx(
          'absolute z-20',
          canClickToReveal && !isRevealed && 'cursor-pointer transition-[filter] duration-300 hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]',
        )}
        onClick={handleBackgroundClick}
        onTransitionEnd={handleMockupAnimationComplete}
        style={{
          height: '100vh',
          aspectRatio: '430/932',
          willChange: isMockupAnimating ? 'transform' : 'auto',
          transform: `translateY(${mockupY})`,
          transition: transitionEnabled
            ? `transform ${mockupY === '0%' ? 500 : 700}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
            : 'none',
        }}>
        <Image
          src='/images/marketing/img_mockup_iphone.png'
          alt='iPhone Mockup'
          fill
          className='object-contain'
          priority
        />

        {/* 베젤 안 영역에 실제 앱(children)을 직접 렌더 — 더 이상 iframe을 쓰지 않는다.
            scale 트릭은 그대로 두어 432×932 좌표계가 베젤 영역에 정확히 맞춰지도록 한다.
            transform + contain으로 자식의 fixed positioning이 이 컨테이너 기준으로 격리된다. */}
        <div
          className='absolute overflow-hidden rounded-[40px]'
          style={{
            top: '7.85%',
            left: '7.9%',
            right: '7.9%',
            bottom: '7.85%',
            contain: 'layout paint',
          }}>
          <div
            className='relative'
            style={{
              aspectRatio: '432/932',
              height: '100vh',
              transform: `scale(${scale * 1.0})`,
              transformOrigin: 'top left',
            }}>
            {children}
          </div>
          {/* reveal 전: children 위 투명 오버레이로 클릭 가로채기 / reveal 후: 제거하여 조작 허용 */}
          {!isRevealed && <div className='absolute inset-0 z-10' />}
          {/* 모달 portal: 베젤 안 영역 부모(contain: layout paint) 안에 둠 → portal 자식의
              fixed positioning이 viewport가 아닌 이 영역을 containing block으로 사용 →
              BottomSheet/Modal이 mockup 화면 영역 안에서 뜬다. */}
          <div id={ROOT_PORTAL_ID} className='pointer-events-none absolute inset-0' />
        </div>
      </div>
    </div>
  )
}
