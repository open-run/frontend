'use client'

import { RefObject, useEffect, useRef } from 'react'
import { useAppStore } from '@store/app'

const HIDE_DELAY_MS = 600
const MIN_THUMB_HEIGHT = 32

/**
 * 웹에서 네이티브 스크롤바를 숨긴(scrollbar-web-hidden) 컨테이너 위에 겹쳐 그리는 오버레이 썸.
 * 레이아웃 공간을 차지하지 않으며, 스크롤 중에만 나타났다가 멈추면 사라진다.
 * 부모 요소는 position: relative여야 한다. 앱(WebView)에서는 렌더링하지 않고,
 * scrollbar-web-hidden도 body.app에서는 비활성이라 시스템 스크롤바가 그대로 보인다.
 */
export default function OverlayScrollbar({ scrollRef }: { scrollRef: RefObject<HTMLElement | null> }) {
  const isApp = useAppStore((state) => state.isApp)
  const thumbRef = useRef<HTMLDivElement>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (isApp) return

    const container = scrollRef.current
    const thumb = thumbRef.current
    if (!container || !thumb) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      if (scrollHeight <= clientHeight) return

      const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, MIN_THUMB_HEIGHT)
      const maxThumbTop = clientHeight - thumbHeight
      const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * maxThumbTop

      thumb.style.height = `${thumbHeight}px`
      thumb.style.transform = `translateY(${thumbTop}px)`
      thumb.style.opacity = '1'

      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = setTimeout(() => {
        thumb.style.opacity = '0'
      }, HIDE_DELAY_MS)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
      clearTimeout(hideTimerRef.current)
    }
  }, [isApp, scrollRef])

  if (isApp) return null

  return (
    <div
      ref={thumbRef}
      aria-hidden
      className='overlay-scrollbar-thumb pointer-events-none absolute right-4 top-0 w-5 rounded-full opacity-0 transition-opacity duration-300'
    />
  )
}
