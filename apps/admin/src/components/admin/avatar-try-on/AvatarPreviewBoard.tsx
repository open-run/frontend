import { WearingAvatar } from '@openrun/types'
import { Avatar as AvatarComponent } from '@openrun/ui'
import { TransparentOpenrunIcon } from '@openrun/ui/icons/openrun'
import { ResetIcon } from '@openrun/ui/icons/reset'
import { colors } from '@openrun/ui/styles/colors'
import { AVATAR_IMAGE_SIZES } from './constants'

type Props = {
  wearingAvatar: WearingAvatar
  onReset: () => void
}

export default function AvatarPreviewBoard({ wearingAvatar, onReset }: Props) {
  return (
    <div className='relative mx-auto flex h-248 w-full max-w-[380px] justify-center rounded-16 bg-black-darken'>
      <TransparentOpenrunIcon
        className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        size={160}
        color={colors.white}
      />
      <AvatarComponent className='absolute top-16 h-270 w-216 flex-shrink-0' sizes={AVATAR_IMAGE_SIZES} {...wearingAvatar} />
      <button
        type='button'
        aria-label='아바타 초기화'
        className='absolute bottom-8 right-8 z-10 flex h-36 w-36 items-center justify-center rounded-full bg-white/90 active-press-duration active:scale-90 hover:bg-white'
        onClick={onReset}>
        <ResetIcon />
      </button>
    </div>
  )
}
