'use client'

import { useMemo, useState } from 'react'
import { useAdminNftAvatarTryOnItemsQuery } from '@apis/v1/admin/query'
import { Avatar, SelectedCategory, WearingAvatar } from '@openrun/types'
import { Category } from '@openrun/ui'
import ImageWarmup from '@shared/ImageWarmup'
import AvatarPartsGrid, { AvatarPartsGridSkeleton } from './AvatarPartsGrid'
import AvatarPreviewBoard from './AvatarPreviewBoard'
import { AVATAR_IMAGE_HEIGHT, AVATAR_IMAGE_SIZES, AVATAR_IMAGE_WIDTH } from './constants'
import { EMPTY_WEARING_AVATAR, getWearableImageUrls, uniqueImageUrls } from './wearingAvatar'

export default function AdminAvatarTryOnPanel() {
  const [wearingAvatar, setWearingAvatar] = useState<WearingAvatar>(EMPTY_WEARING_AVATAR)
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>({
    mainCategory: 'upperClothing',
    subCategory: null,
  })
  const avatarItemsQuery = useAdminNftAvatarTryOnItemsQuery()
  const avatarItems = useMemo(() => avatarItemsQuery.data?.data ?? [], [avatarItemsQuery.data])
  const filteredAvatarItems = useMemo(
    () => avatarItems.filter((avatar) => isInSelectedCategory(avatar, selectedCategory)),
    [avatarItems, selectedCategory],
  )
  // 현재 카테고리의 장착 이미지를 미리 받아와 hover 프리뷰가 즉시 뜨게 한다 (Swarm 게이트웨이가 느림)
  const warmupImageUrls = useMemo(
    () => uniqueImageUrls(filteredAvatarItems.flatMap(getWearableImageUrls)),
    [filteredAvatarItems],
  )

  return (
    <section className='glass-panel overflow-hidden rounded-16'>
      <ImageWarmup
        imageUrls={warmupImageUrls}
        width={AVATAR_IMAGE_WIDTH}
        height={AVATAR_IMAGE_HEIGHT}
        sizes={AVATAR_IMAGE_SIZES}
      />
      <div className='flex min-h-[640px] flex-col'>
        <aside className='border-b border-black/[0.06] p-16'>
          <AvatarPreviewBoard wearingAvatar={wearingAvatar} onReset={() => setWearingAvatar(EMPTY_WEARING_AVATAR)} />
        </aside>

        <section className='flex min-h-0 flex-col bg-white/25'>
          <div className='bg-white/60 pb-12 backdrop-blur-[8px]'>
            <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
          </div>

          <div className='flex items-center justify-between px-16 pt-16'>
            <h3 className='text-16 font-bold text-black'>파츠 목록</h3>
            <span className='font-jost text-12 font-bold text-[#6e6e73]'>
              {filteredAvatarItems.length} / {avatarItems.length}
            </span>
          </div>

          {avatarItemsQuery.isLoading ? (
            <AvatarPartsGridSkeleton />
          ) : avatarItemsQuery.error ? (
            <div className='mx-16 mt-16 rounded-12 border border-pink/25 bg-pink/[0.08] p-16 text-14 font-medium text-pink'>
              아바타 파츠를 불러오지 못했습니다.
            </div>
          ) : (
            <AvatarPartsGrid
              avatarList={filteredAvatarItems}
              wearingAvatar={wearingAvatar}
              onChangeWearingAvatar={setWearingAvatar}
            />
          )}
        </section>
      </div>
    </section>
  )
}

function isInSelectedCategory(avatar: Avatar, selectedCategory: SelectedCategory): boolean {
  if (selectedCategory.mainCategory !== avatar.mainCategory) return false
  if (selectedCategory.subCategory === null) return true

  return selectedCategory.subCategory === avatar.subCategory
}
