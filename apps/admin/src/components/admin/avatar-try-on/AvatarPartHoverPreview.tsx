import { createPortal } from 'react-dom'
import { Avatar as AvatarComponent } from '@openrun/ui'
import { TransparentOpenrunIcon } from '@openrun/ui/icons/openrun'
import { colors } from '@openrun/ui/styles/colors'
import { AVATAR_IMAGE_SIZES } from './constants'
import { AvatarPartHoverPreviewState } from './useAvatarPartHoverPreview'
import { EMPTY_WEARING_AVATAR, hasWearableImage, toggleWearingAvatar } from './wearingAvatar'

type Props = {
  preview: AvatarPartHoverPreviewState
}

/** 기본 아바타에 호버 중인 파츠를 입힌 모습을 보여주는 플로팅 패널. 장착 이미지가 없으면 로고로 대체한다. */
export default function AvatarPartHoverPreview({ preview }: Props) {
  // glass-panel의 backdrop-filter가 fixed 요소의 기준을 패널로 바꿔버리므로 body로 포털해야 좌표·잘림이 정상 동작한다
  return createPortal(
    <div
      className='pointer-events-none fixed z-modal'
      style={{
        left: preview.left,
        top: preview.top,
        transform: preview.alignLeft ? 'translate(-100%, -50%)' : 'translateY(-50%)',
      }}>
      <div className='glass-panel rounded-16 p-8'>
        <div className='relative h-[200px] w-[160px]'>
          {hasWearableImage(preview.avatar) ? (
            <AvatarComponent
              className='absolute left-1/2 top-0 h-[190px] w-[152px] flex-shrink-0 -translate-x-1/2'
              sizes={AVATAR_IMAGE_SIZES}
              {...toggleWearingAvatar(EMPTY_WEARING_AVATAR, preview.avatar)}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center'>
              <TransparentOpenrunIcon size={96} color={colors.gray.darker} />
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
