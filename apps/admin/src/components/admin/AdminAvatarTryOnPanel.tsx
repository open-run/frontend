'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useAdminNftAvatarTryOnItemsQuery } from '@apis/v1/admin/query'
import { Avatar, SelectedCategory, SubCategory, WearingAvatar } from '@openrun/types'
import { Category } from '@openrun/ui'
import { Avatar as AvatarComponent } from '@openrun/ui'
import { LoadingLogo } from '@openrun/ui'
import { TransparentOpenrunIcon } from '@openrun/ui/icons/openrun'
import { ResetIcon } from '@openrun/ui/icons/reset'
import { colors } from '@openrun/ui/styles/colors'

const FALLBACK_PREVIEW_IMAGE_URL = '/images/avatars/avatar_default_body.png'

const EMPTY_WEARING_AVATAR: WearingAvatar = {
  upperClothing: null,
  lowerClothing: null,
  fullSet: null,
  footwear: null,
  face: null,
  skin: null,
  hair: null,
  accessories: {
    'head-accessories': null,
    'ear-accessories': null,
    'body-accessories': null,
    'eye-accessories': null,
  },
}

export default function AdminAvatarTryOnPanel() {
  const [selectedAvatar, setSelectedAvatar] = useState<WearingAvatar>(EMPTY_WEARING_AVATAR)
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>({
    mainCategory: 'upperClothing',
    subCategory: null,
  })
  const avatarItemsQuery = useAdminNftAvatarTryOnItemsQuery()
  const avatarItems = useMemo(() => avatarItemsQuery.data?.data ?? [], [avatarItemsQuery.data])
  const filteredAvatarItems = useMemo(
    () =>
      avatarItems.filter((avatar) => {
        if (selectedCategory.mainCategory !== avatar.mainCategory) return false
        if (selectedCategory.subCategory === null) return true
        return selectedCategory.subCategory === avatar.subCategory
      }),
    [avatarItems, selectedCategory],
  )

  return (
    <section className='overflow-hidden rounded-8 bg-white shadow-floating-primary'>
      <div className='grid min-h-[640px] lg:grid-cols-[380px_1fr]'>
        <aside className='border-b border-gray p-16 lg:border-b-0 lg:border-r'>
          <div className='mb-16 flex items-center justify-between'>
            <div>
              <h2 className='text-18 font-bold text-black'>아바타 장착</h2>
              <p className='mt-4 text-13 text-gray-darkest'>준비된 모든 파츠를 조합해 확인합니다.</p>
            </div>
            <button
              type='button'
              className='flex h-36 items-center gap-6 rounded-8 bg-gray px-10 text-12 font-bold text-black active-press-duration active:scale-95 hover:bg-gray-darken'
              onClick={() => setSelectedAvatar(EMPTY_WEARING_AVATAR)}>
              <ResetIcon />
              초기화
            </button>
          </div>

          <div className='relative flex h-248 w-full justify-center rounded-16 bg-black-darken'>
            <TransparentOpenrunIcon
              className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              size={160}
              color={colors.white}
            />
            <AvatarComponent
              className='absolute top-16 h-270 w-216 flex-shrink-0'
              {...selectedAvatar}
            />
          </div>
        </aside>

        <section className='flex min-h-0 flex-col bg-gray-lighten'>
          <div className='bg-white pb-12 shadow-floating-primary'>
            <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
          </div>

          <div className='flex items-center justify-between px-16 pt-16'>
            <h3 className='text-16 font-bold text-black'>파츠 목록</h3>
            <span className='font-jost text-13 font-bold text-gray-darkest'>
              {filteredAvatarItems.length} / {avatarItems.length}
            </span>
          </div>

          {avatarItemsQuery.isLoading ? (
            <div className='flex h-320 items-center justify-center'>
              <LoadingLogo />
            </div>
          ) : avatarItemsQuery.error ? (
            <div className='mx-16 mt-16 rounded-8 border border-pink/30 bg-pink/10 p-16 text-14 font-bold text-pink'>
              아바타 파츠를 불러오지 못했습니다.
            </div>
          ) : (
            <AdminTryOnItemGrid
              avatarList={filteredAvatarItems}
              selectedAvatar={selectedAvatar}
              setSelectedAvatar={setSelectedAvatar}
            />
          )}
        </section>
      </div>
    </section>
  )
}

function AdminTryOnItemGrid({
  avatarList,
  selectedAvatar,
  setSelectedAvatar,
}: {
  avatarList: Avatar[]
  selectedAvatar: WearingAvatar
  setSelectedAvatar: (avatar: WearingAvatar) => void
}) {
  if (avatarList.length === 0) {
    return (
      <section className='w-full pt-80 text-center text-16 text-gray-darkest'>
        <p>선택한 카테고리에 아이템이 없어요.</p>
      </section>
    )
  }

  return (
    <section className='min-h-0 flex-1 overflow-y-auto px-16 pb-40 pt-16'>
      <div className='grid grid-cols-3 gap-8 md:grid-cols-4 xl:grid-cols-5'>
        {avatarList.map((avatar) => {
          const selected = isSelectedAvatar(avatar, selectedAvatar)
          const equipPreviewImageUrl = getEquipPreviewImageUrl(avatar)
          const hasThumbnailImage = avatar.thumbnailUrl != null && avatar.thumbnailUrl !== ''
          const hasEquipImage = equipPreviewImageUrl != null && equipPreviewImageUrl !== ''
          const missingLabels = [
            hasThumbnailImage ? null : '썸네일 없음',
            hasEquipImage ? null : '장착 없음',
          ].filter((label): label is string => label != null)

          return (
            <button
              key={avatar.id}
              type='button'
              aria-pressed={selected}
              disabled={!hasEquipImage}
              className={clsx(
                'relative flex w-full flex-col items-center gap-10 rounded-8 p-12 transition active-press-duration',
                !hasEquipImage
                  ? 'cursor-not-allowed bg-white/30 opacity-60'
                  : selected
                  ? 'bg-white shadow-floating-primary ring-2 ring-primary'
                  : 'bg-white/40 hover:bg-white hover:shadow-floating-primary active:scale-[0.98]',
              )}
              onClick={() => setSelectedAvatar(toggleAvatar(selectedAvatar, avatar))}>
              <div className='relative aspect-square w-full max-w-80'>
                <Image
                  alt={avatar.name}
                  src={getPreviewImageUrl(avatar)}
                  loading='lazy'
                  fill
                  sizes='(max-width: 768px) 33vw, 96px'
                  className='object-contain'
                />

                {hasEquipImage ? (
                  <div className='absolute right-0 top-0 h-28 w-28 overflow-hidden rounded-full border border-gray bg-white shadow-floating-primary'>
                    <Image
                      alt={`${avatar.name} 장착 이미지`}
                      src={equipPreviewImageUrl}
                      loading='lazy'
                      fill
                      sizes='28px'
                      className='scale-125 object-contain'
                    />
                  </div>
                ) : (
                  <div className='absolute right-0 top-0 flex h-28 w-28 items-center justify-center rounded-full border border-pink/30 bg-pink/10 text-10 font-bold text-pink'>
                    !
                  </div>
                )}

                {missingLabels.length > 0 && (
                  <div className='absolute left-0 top-0 flex max-w-full flex-col items-start gap-2'>
                    {missingLabels.map((label) => (
                      <span
                        key={label}
                        className={clsx(
                          'max-w-full truncate rounded-full px-5 py-2 text-10 font-bold shadow-floating-primary',
                          label === '장착 없음' ? 'bg-pink text-white' : 'bg-black/75 text-white',
                        )}>
                        {label}
                      </span>
                    ))}
                  </div>
                )}

                <div className='absolute bottom-0 left-1/2 flex h-20 -translate-x-1/2 -skew-x-[10deg] transform items-center justify-center rounded-lg border-2 border-black bg-secondary px-8'>
                  <span className='text-12 font-[900]'>NEW</span>
                </div>
              </div>

              <span className='w-full truncate text-center text-12 text-black-darken'>{avatar.name}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function toggleAvatar(selectedAvatar: WearingAvatar, avatar: Avatar): WearingAvatar {
  if (avatar.mainCategory === 'accessories') {
    const subCategory = avatar.subCategory as SubCategory
    const currentAvatar = selectedAvatar.accessories[subCategory]

    return {
      ...selectedAvatar,
      accessories: {
        ...selectedAvatar.accessories,
        [subCategory]: currentAvatar?.id === avatar.id ? null : avatar,
      },
    }
  }

  const currentAvatar = selectedAvatar[avatar.mainCategory]

  return {
    ...selectedAvatar,
    [avatar.mainCategory]: currentAvatar?.id === avatar.id ? null : avatar,
  }
}

function isSelectedAvatar(avatar: Avatar, selectedAvatar: WearingAvatar) {
  if (avatar.mainCategory === 'accessories') {
    return selectedAvatar.accessories[avatar.subCategory as SubCategory]?.id === avatar.id
  }

  return selectedAvatar[avatar.mainCategory]?.id === avatar.id
}

function getPreviewImageUrl(avatar: Avatar): string {
  return avatar.thumbnailUrl ?? getEquipPreviewImageUrl(avatar) ?? FALLBACK_PREVIEW_IMAGE_URL
}

function getEquipPreviewImageUrl(avatar: Avatar): string | null {
  if (Array.isArray(avatar.imageUrl)) {
    return avatar.imageUrl.find((imageUrl) => imageUrl != null && imageUrl !== '') ?? null
  }

  return avatar.imageUrl ?? null
}
