import { useModal } from '@contexts/ModalProvider'
import { Avatar, SubCategory, WearingAvatar } from '@type/avatar'
import { InfoIcon } from '@icons/info'
import { MODAL_KEY } from '@constants/modal'
import { getAvatarPreviewImageUrl } from '@utils/avatarImage'
import DetailModal from './DetailModal'
import AvatarThumbnail from './AvatarThumbnail'
import RarityIcon from './shared/RarityIcon'

export default function AvatarList({
  avatarList,
  selectedAvatar,
  setSelectedAvatar,
  onAvatarWarmup,
}: {
  avatarList: Avatar[]
  selectedAvatar: WearingAvatar
  setSelectedAvatar: (avatar: WearingAvatar) => void
  onAvatarWarmup?: (avatar: Avatar) => void
}) {
  const { showModal } = useModal()

  const handleAvatarSelect = (avatar: Avatar) => {
    if (avatar.mainCategory === 'accessories') {
      if (selectedAvatar.accessories?.[avatar.subCategory as SubCategory]?.id === avatar.id) {
        setSelectedAvatar({
          ...selectedAvatar,
          accessories: {
            ...selectedAvatar.accessories,
            [avatar.subCategory as SubCategory]: null,
          },
        })
      } else {
        setSelectedAvatar({
          ...selectedAvatar,
          accessories: {
            ...selectedAvatar.accessories,
            [avatar.subCategory as SubCategory]: avatar,
          },
        })
      }
    } else {
      if (selectedAvatar[avatar.mainCategory]?.id === avatar.id) {
        setSelectedAvatar({
          ...selectedAvatar,
          [avatar.mainCategory]: null,
        })
      } else {
        setSelectedAvatar({
          ...selectedAvatar,
          [avatar.mainCategory]: avatar,
        })
      }
    }
  }

  return (
    <section className='scrollbar-web-hidden h-full w-full overflow-y-auto px-16 pb-30 pt-24'>
      {avatarList.length !== 0 ? (
        <div className='grid grid-cols-3 gap-8'>
          {avatarList.map((avatar) => (
            <button
              key={avatar.id}
              className={`relative flex w-full flex-col items-center gap-10 rounded-8 bg-[rgba(255,255,255,0.20)] p-12 hover:bg-white hover:shadow-floating-primary ${
                avatar.mainCategory === 'accessories'
                  ? selectedAvatar.accessories[avatar.subCategory as SubCategory]?.id === avatar.id
                    ? 'bg-white shadow-floating-primary'
                    : ''
                  : selectedAvatar[avatar.mainCategory]?.id === avatar.id
                    ? 'bg-white shadow-floating-primary'
                    : ''
              }`}
              onFocus={() => onAvatarWarmup?.(avatar)}
              onPointerDown={() => onAvatarWarmup?.(avatar)}
              onClick={() => handleAvatarSelect(avatar)}>
              <div className='relative aspect-square w-full max-w-80'>
                <AvatarThumbnail avatar={avatar} />
                {/* Skewed New Label */}
                <div className='absolute bottom-0 left-[50%] flex h-20 -translate-x-[50%] -skew-x-[10deg] transform items-center justify-center gap-4 rounded-lg border-2 border-black bg-secondary px-8'>
                  <span className='text-12 font-[900]'>NEW</span>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <RarityIcon rarity={avatar.rarity} size={16} />
                <span className='truncate text-12 text-black-darken'>{avatar.name}</span>
              </div>

              {/* Info Modal */}
              <div
                className='absolute right-6 top-6'
                onClick={(e) => {
                  e.stopPropagation()
                  showModal({
                    key: MODAL_KEY.AVATAR_DETAIL,
                    component: (
                      <DetailModal
                        serialNumber={avatar.id}
                        imageSrc={getAvatarPreviewImageUrl(avatar)}
                        rarity={avatar.rarity}
                        category={avatar.mainCategory}
                        name={avatar.name}
                      />
                    ),
                  })
                }}>
                <InfoIcon />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <section className='w-full pt-80 text-center text-16 text-gray-darkest'>
          <p>아이템이 없어요.</p>
          <p>도전과제를 달성하고 NFT를 획득하세요!</p>
        </section>
      )}
    </section>
  )
}
