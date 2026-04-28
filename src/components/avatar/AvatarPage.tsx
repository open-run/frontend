'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Avatar, SelectedCategory, WearingAvatar } from '@type/avatar'
import AvatarComponent from '@shared/Avatar'
import { ArrowLeftIcon } from '@icons/arrow'
import { TransparentOpenrunIcon } from '@icons/openrun'
import { ResetIcon } from '@icons/reset'
import { SaveWearingNftAvatarRequest } from '@apis/v1/nft/avatar-items'
import { useSaveWearingNftAvatarMutation } from '@apis/v1/nft/avatar-items/mutation'
import { useOwnedNftAvatarItemsQuery, useWearingNftAvatarQuery } from '@apis/v1/nft/avatar-items/query'
import { colors } from '@styles/colors'
import AvatarList from './AvatarList'
import Category from './Category'

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

export default function AvatarPage() {
  const router = useRouter()

  const avatarRef = useRef<HTMLDivElement>(null)
  const [selectedAvatar, setSelectedAvatar] = useState<WearingAvatar>(EMPTY_WEARING_AVATAR)
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>({
    mainCategory: 'upperClothing',
    subCategory: null,
  })
  const { data: ownedAvatarItems, isLoading: isOwnedAvatarItemsLoading } = useOwnedNftAvatarItemsQuery()
  const { data: wearingAvatar, isLoading: isWearingAvatarLoading } = useWearingNftAvatarQuery()
  const saveWearingAvatarMutation = useSaveWearingNftAvatarMutation()

  useEffect(() => {
    if (wearingAvatar?.data) {
      setSelectedAvatar(wearingAvatar.data)
    }
  }, [wearingAvatar])

  const avatarList = ownedAvatarItems?.data ?? []
  const isLoaded = !isOwnedAvatarItemsLoading && !isWearingAvatarLoading

  const filteredAvatarList = avatarList.filter((avatar) => {
    if (selectedCategory.mainCategory === avatar.mainCategory) {
      if (selectedCategory.subCategory === null) return true
      return selectedCategory.subCategory === avatar.subCategory
    }
    return false
  })

  const handleReset = () => {
    setSelectedAvatar(EMPTY_WEARING_AVATAR)
  }

  const handleSave = () => {
    saveWearingAvatarMutation.mutate(toSaveWearingAvatarRequest(selectedAvatar), {
      onSuccess: ({ data }) => {
        setSelectedAvatar(data)
      },
    })
  }

  if (!isLoaded) {
    return (
      <article className='h-full w-full bg-white app:pt-50'>
        <header className='relative z-20 flex h-60 w-full items-center justify-center bg-white px-5'>
          <h1 className='text-16 font-bold text-black'>아바타 변경</h1>
        </header>
      </article>
    )
  }

  return (
    <article className='h-full w-full bg-white app:pt-50'>
      {/* 헤더 */}
      <header className='relative z-20 flex h-60 w-full items-center justify-center bg-white px-5'>
        <button
          className='absolute left-16 -translate-x-4 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'
          onClick={() => router.back()}>
          <ArrowLeftIcon size={24} color={colors.black.darken} />
        </button>
        <h1 className='text-16 font-bold text-black'>아바타 변경</h1>
        <button
          className='absolute right-16 translate-x-8 rounded-8 px-8 py-4 active-press-duration active:scale-90 active:bg-gray/50'
          disabled={saveWearingAvatarMutation.isPending}
          onClick={handleSave}>
          <span className='text-14 text-black'>저장</span>
        </button>
      </header>

      <section className='flex h-[calc(100%-60px)] w-full flex-col items-center bg-gray-lighten'>
        {/* 아바타 영역 */}
        <section className='z-10 w-full bg-white px-16 shadow-floating-primary'>
          <div className='relative mb-16 flex h-248 w-full justify-center rounded-16 bg-black-darken'>
            {/* 오픈런 아이콘 */}
            <TransparentOpenrunIcon
              className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              size={160}
              color={colors.white}
            />

            {/* 아바타 이미지 */}
            <AvatarComponent
              ref={avatarRef}
              className='absolute top-16 h-270 w-216 flex-shrink-0'
              {...selectedAvatar}
            />

            {/* 초기화 버튼 */}
            <button
              className='absolute bottom-8 right-8 flex aspect-square w-[40px] items-center justify-center rounded-full bg-white active-press-duration active:scale-90 active:bg-white/90'
              onClick={handleReset}>
              <ResetIcon />
            </button>
          </div>
        </section>

        {/* 카테고리 */}
        <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        {/* 보유하고 있는 아바타 리스트 */}
        <AvatarList
          avatarList={filteredAvatarList}
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
        />
      </section>
    </article>
  )
}

function toSaveWearingAvatarRequest(avatar: WearingAvatar): SaveWearingNftAvatarRequest {
  return {
    fullSet: getNftItemId(avatar.fullSet),
    upperClothing: getNftItemId(avatar.upperClothing),
    lowerClothing: getNftItemId(avatar.lowerClothing),
    footwear: getNftItemId(avatar.footwear),
    face: getNftItemId(avatar.face),
    skin: getNftItemId(avatar.skin),
    hair: getNftItemId(avatar.hair),
    accessories: {
      'head-accessories': getNftItemId(avatar.accessories['head-accessories']),
      'eye-accessories': getNftItemId(avatar.accessories['eye-accessories']),
      'ear-accessories': getNftItemId(avatar.accessories['ear-accessories']),
      'body-accessories': getNftItemId(avatar.accessories['body-accessories']),
    },
  }
}

function getNftItemId(avatar: Avatar | null): number | null {
  if (avatar == null) return null

  const nftItemId = avatar.nftItemId ?? Number(avatar.id)
  return Number.isFinite(nftItemId) ? nftItemId : null
}
