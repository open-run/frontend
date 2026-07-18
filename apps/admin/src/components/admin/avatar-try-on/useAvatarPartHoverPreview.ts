import { MouseEvent, useEffect, useState } from 'react'
import { Avatar } from '@openrun/types'

// AvatarPartHoverPreview 실제 렌더 폭: w-[160px] + p-8 좌우 = 176px
const PREVIEW_PANEL_WIDTH = 176
const PREVIEW_PANEL_GAP = 8
const VIEWPORT_VERTICAL_MARGIN = 120

export type AvatarPartHoverPreviewState = {
  avatar: Avatar
  left: number
  top: number
  alignLeft: boolean
}

/** 파츠 카드 옆에 띄우는 호버 프리뷰의 표시 여부·위치를 관리한다. 기본은 카드 오른쪽, 공간이 없으면 왼쪽. */
export function useAvatarPartHoverPreview(avatarList: Avatar[]) {
  const [preview, setPreview] = useState<AvatarPartHoverPreviewState | null>(null)

  // 카테고리 전환 등으로 목록이 바뀌면 호버 중이던 카드가 mouseleave 없이 사라질 수 있어 패널을 정리한다
  useEffect(() => {
    setPreview(null)
  }, [avatarList])

  const showPreview = (avatar: Avatar, event: MouseEvent<HTMLElement>) => {
    const cardRect = event.currentTarget.getBoundingClientRect()
    const alignLeft = cardRect.right + PREVIEW_PANEL_GAP + PREVIEW_PANEL_WIDTH > window.innerWidth
    const top = clamp(
      cardRect.top + cardRect.height / 2,
      VIEWPORT_VERTICAL_MARGIN,
      window.innerHeight - VIEWPORT_VERTICAL_MARGIN,
    )

    setPreview({
      avatar,
      left: alignLeft ? cardRect.left - PREVIEW_PANEL_GAP : cardRect.right + PREVIEW_PANEL_GAP,
      top,
      alignLeft,
    })
  }

  const hidePreview = () => setPreview(null)

  return { preview, showPreview, hidePreview }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
