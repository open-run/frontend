'use client'

import { useEffect } from 'react'
import { useAppEnv } from '@contexts/AppEnvProvider'

const HIDE_DELAY_MS = 600
const FADE_MS = 300
const MIN_THUMB_HEIGHT = 32
const THUMB_WIDTH = 5
const EDGE_GAP = 4

type ThumbEntry = {
  thumb: HTMLDivElement
  hideTimer?: number
  removeTimer?: number
}

/**
 * 전역 오버레이 스크롤바 매니저 — 루트 레이아웃에 1회만 마운트한다.
 * scrollbar-web-hidden 클래스가 붙은 세로 스크롤 컨테이너라면 어디든,
 * 스크롤되는 동안 body에 fixed 썸을 띄워 위치를 동기화하고 멈추면 페이드아웃 후 제거한다.
 * 컨테이너 쪽에는 클래스 외에 ref·컴포넌트·relative 부모가 일절 필요 없다.
 * 앱(WebView)에서는 아무것도 하지 않는다 — scrollbar-web-hidden이 body.app에서
 * 비활성이라 시스템 스크롤바가 그대로 담당한다.
 */
export default function OverlayScrollbarManager() {
  const { isApp } = useAppEnv()

  useEffect(() => {
    if (isApp) return

    const thumbs = new Map<HTMLElement, ThumbEntry>()

    const handleScroll = (event: Event) => {
      const container = event.target
      if (!(container instanceof HTMLElement) || !container.classList.contains('scrollbar-web-hidden')) return

      const { scrollTop, scrollHeight, clientHeight } = container
      if (scrollHeight <= clientHeight) return

      let entry = thumbs.get(container)
      if (!entry) {
        const thumb = document.createElement('div')
        thumb.className = 'overlay-scrollbar-thumb'
        thumb.style.cssText = `position:fixed;width:${THUMB_WIDTH}px;border-radius:9999px;pointer-events:none;opacity:0;transition:opacity ${FADE_MS}ms;z-index:9999`
        document.body.appendChild(thumb)
        entry = { thumb }
        thumbs.set(container, entry)
      }

      const rect = container.getBoundingClientRect()
      const thumbHeight = Math.max((clientHeight / scrollHeight) * rect.height, MIN_THUMB_HEIGHT)
      const maxThumbTop = rect.height - thumbHeight
      const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * maxThumbTop

      const { thumb } = entry
      thumb.style.height = `${thumbHeight}px`
      thumb.style.left = `${rect.right - THUMB_WIDTH - EDGE_GAP}px`
      thumb.style.top = `${rect.top + thumbTop}px`
      thumb.style.opacity = '1'

      window.clearTimeout(entry.hideTimer)
      window.clearTimeout(entry.removeTimer)
      entry.hideTimer = window.setTimeout(() => {
        // 컨테이너가 이미 DOM에서 제거됐으면(모달 닫힘 등) 페이드 없이 즉시 정리
        if (!container.isConnected) {
          thumb.remove()
          thumbs.delete(container)
          return
        }
        thumb.style.opacity = '0'
        entry.removeTimer = window.setTimeout(() => {
          thumb.remove()
          thumbs.delete(container)
        }, FADE_MS)
      }, HIDE_DELAY_MS)
    }

    document.addEventListener('scroll', handleScroll, { capture: true, passive: true })
    return () => {
      document.removeEventListener('scroll', handleScroll, { capture: true })
      thumbs.forEach(({ thumb, hideTimer, removeTimer }) => {
        window.clearTimeout(hideTimer)
        window.clearTimeout(removeTimer)
        thumb.remove()
      })
      thumbs.clear()
    }
  }, [isApp])

  return null
}
