import { Avatar, WearingAvatar } from '@openrun/types'
import AvatarPartCard from './AvatarPartCard'
import AvatarPartHoverPreview from './AvatarPartHoverPreview'
import { useAvatarPartHoverPreview } from './useAvatarPartHoverPreview'
import { isWearingAvatar, toggleWearingAvatar } from './wearingAvatar'

const GRID_CLASSNAME = 'grid grid-cols-4 gap-8 md:grid-cols-6 xl:grid-cols-8'
const SKELETON_CARD_COUNT = 16

type Props = {
  avatarList: Avatar[]
  wearingAvatar: WearingAvatar
  onChangeWearingAvatar: (wearingAvatar: WearingAvatar) => void
}

export default function AvatarPartsGrid({ avatarList, wearingAvatar, onChangeWearingAvatar }: Props) {
  const { preview, showPreview, hidePreview } = useAvatarPartHoverPreview(avatarList)

  if (avatarList.length === 0) {
    return (
      <section className='w-full pt-80 text-center text-16 text-[#6e6e73]'>
        <p>선택한 카테고리에 아이템이 없어요.</p>
      </section>
    )
  }

  return (
    <section className='scrollbar-web-hidden min-h-0 flex-1 overflow-y-auto px-16 pb-40 pt-16'>
      <div className={GRID_CLASSNAME}>
        {avatarList.map((avatar, index) => (
          <AvatarPartCard
            key={`${avatar.id}-${index}`}
            avatar={avatar}
            selected={isWearingAvatar(wearingAvatar, avatar)}
            onToggle={() => onChangeWearingAvatar(toggleWearingAvatar(wearingAvatar, avatar))}
            onHoverStart={(event) => showPreview(avatar, event)}
            onHoverEnd={hidePreview}
          />
        ))}
      </div>

      {preview && <AvatarPartHoverPreview preview={preview} />}
    </section>
  )
}

export function AvatarPartsGridSkeleton() {
  return (
    <section className='scrollbar-web-hidden min-h-0 flex-1 overflow-y-auto px-16 pb-40 pt-16'>
      <div className={GRID_CLASSNAME}>
        {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
          <div key={index} className='glass-inset flex w-full flex-col items-center gap-10 rounded-8 p-12'>
            <div className='aspect-square w-full max-w-80 animate-pulse rounded-8 bg-black/[0.07]' />
            <div className='h-12 w-3/5 animate-pulse rounded-4 bg-black/[0.07]' />
          </div>
        ))}
      </div>
    </section>
  )
}
