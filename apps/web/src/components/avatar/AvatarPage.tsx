'use client'

import { useQueryClient } from '@tanstack/react-query'
import html2canvas from 'html2canvas'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { Avatar, SelectedCategory, WearingAvatar } from '@type/avatar'
import AvatarComponent from '@shared/Avatar'
import ToastModal from '@shared/ToastModal'
import { ArrowLeftIcon } from '@icons/arrow'
import { EraserIcon } from '@icons/eraser'
import { TransparentOpenrunIcon } from '@icons/openrun'
import { ResetIcon } from '@icons/reset'
import { SaveIcon } from '@icons/save'
import useAppInsetSize from '@hooks/useAppInsetSize'
import { useAvatarPageImageWarmup } from '@hooks/useAvatarPageImageWarmup'
import { bungsQueries } from '@apis/v1/bungs/query'
import { SaveWearingNftAvatarRequest } from '@apis/v1/nft/avatar-items'
import { useSaveWearingNftAvatarWithProfileImageMutation } from '@apis/v1/nft/avatar-items/mutation'
import {
  useSuspenseOwnedNftAvatarItemsQuery,
  useSuspenseWearingNftAvatarQuery,
} from '@apis/v1/nft/avatar-items/query'
import { userQueries } from '@apis/v1/users/query'
import { MODAL_KEY } from '@constants/modal'
import { getSelectedCategoryAvatarItems } from '@utils/avatarImage'
import { colors } from '@styles/colors'
import AvatarList from './AvatarList'
import AvatarImageWarmup from './AvatarImageWarmup'
import Category from './Category'

const PROFILE_IMAGE_SIZE = 512
const AVATAR_CAPTURE_SCALE = 2

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
  const queryClient = useQueryClient()
  const { showModal } = useModal()

  const avatarRef = useRef<HTMLDivElement>(null)
  const [selectedAvatar, setSelectedAvatar] = useState<WearingAvatar>(EMPTY_WEARING_AVATAR)
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>({
    mainCategory: 'upperClothing',
    subCategory: null,
  })
  const { data: ownedAvatarItems } = useSuspenseOwnedNftAvatarItemsQuery()
  const { data: wearingAvatar } = useSuspenseWearingNftAvatarQuery()
  const saveWearingAvatarWithProfileImageMutation = useSaveWearingNftAvatarWithProfileImageMutation()
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (wearingAvatar?.data) {
      setSelectedAvatar(wearingAvatar.data)
    }
  }, [wearingAvatar])

  const avatarList = ownedAvatarItems?.data ?? []
  const filteredAvatarList = getSelectedCategoryAvatarItems(avatarList, selectedCategory)
  const avatarPageImageWarmup = useAvatarPageImageWarmup(avatarList, selectedCategory)
  const topPadding = useAppInsetSize('top', 0)

  const handleClearAvatar = () => {
    setSelectedAvatar(EMPTY_WEARING_AVATAR)
  }

  const handleRestoreWearingAvatar = () => {
    setSelectedAvatar(wearingAvatar?.data ?? EMPTY_WEARING_AVATAR)
  }

  const handleSave = async () => {
    if (isSaving) return

    if (!avatarRef.current) {
      showToast(showModal, 'error', '아바타 저장에 실패했습니다.')
      return
    }

    setIsSaving(true)

    try {
      const profileImage = await captureAvatarProfileImage(avatarRef.current)
      const { data } = await saveWearingAvatarWithProfileImageMutation.mutateAsync({
        wearingAvatar: toSaveWearingAvatarRequest(selectedAvatar),
        profileImage,
      })
      setSelectedAvatar(data)

      void queryClient.invalidateQueries({ queryKey: userQueries.me().queryKey })
      void queryClient.invalidateQueries({ queryKey: bungsQueries.all() })

      showToast(showModal, 'success', '아바타 저장 완료!')
      router.replace('/')
    } catch (error) {
      console.error(error)
      showToast(showModal, 'error', '아바타 저장에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <article className='h-full w-full bg-white' style={{ paddingTop: topPadding }}>
      <AvatarImageWarmup
        imageUrls={avatarPageImageWarmup.previewImageUrls}
        width={80}
        height={80}
        sizes='80px'
      />
      <AvatarImageWarmup
        imageUrls={avatarPageImageWarmup.wearableImageUrls}
        width={216}
        height={270}
        sizes='216px'
      />

      {/* 헤더 */}
      <header className='relative z-20 flex h-60 w-full items-center justify-center bg-white px-5'>
        <button
          className='absolute left-16 -translate-x-4 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'
          onClick={() => router.back()}>
          <ArrowLeftIcon size={24} color={colors.black.darken} />
        </button>
        <h1 className='text-16 font-bold text-black'>아바타</h1>
        <button
          aria-label='아바타 저장'
          className='absolute right-16 translate-x-8 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50 disabled:opacity-40'
          disabled={isSaving || saveWearingAvatarWithProfileImageMutation.isPending}
          onClick={handleSave}>
          <SaveIcon size={24} color={colors.black.darken} />
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
              sizes='216px'
              {...selectedAvatar}
            />

            <div className='absolute bottom-8 right-8 flex flex-col gap-8'>
              <button
                aria-label='원래 착용 아바타로 되돌리기'
                className='flex aspect-square w-[40px] items-center justify-center rounded-full bg-white active-press-duration active:scale-90 active:bg-white/90'
                onClick={handleRestoreWearingAvatar}>
                <ResetIcon />
              </button>
              <button
                aria-label='아바타 전체 해제'
                className='flex aspect-square w-[40px] items-center justify-center rounded-full bg-white active-press-duration active:scale-90 active:bg-white/90'
                onClick={handleClearAvatar}>
                <EraserIcon size={24} color={colors.black.darken} />
              </button>
            </div>
          </div>
        </section>

        {/* 카테고리 */}
        <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        {/* 보유하고 있는 아바타 리스트 */}
        <AvatarList
          avatarList={filteredAvatarList}
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
          onAvatarWarmup={avatarPageImageWarmup.warmupAvatarItem}
        />
      </section>
    </article>
  )
}

async function captureAvatarProfileImage(avatarElement: HTMLElement): Promise<Blob> {
  const sourceCanvas = await html2canvas(avatarElement, {
    backgroundColor: null,
    logging: false,
    scale: AVATAR_CAPTURE_SCALE,
    useCORS: true,
  })

  const outputCanvas = document.createElement('canvas')
  outputCanvas.width = PROFILE_IMAGE_SIZE
  outputCanvas.height = PROFILE_IMAGE_SIZE

  const context = outputCanvas.getContext('2d')
  if (context == null) {
    throw new Error('Canvas context를 가져올 수 없습니다.')
  }

  context.clearRect(0, 0, PROFILE_IMAGE_SIZE, PROFILE_IMAGE_SIZE)
  const scale = Math.min(PROFILE_IMAGE_SIZE / sourceCanvas.width, PROFILE_IMAGE_SIZE / sourceCanvas.height)
  const targetWidth = Math.round(sourceCanvas.width * scale)
  const targetHeight = Math.round(sourceCanvas.height * scale)
  const targetX = Math.round((PROFILE_IMAGE_SIZE - targetWidth) / 2)
  const targetY = Math.round((PROFILE_IMAGE_SIZE - targetHeight) / 2)

  context.drawImage(
    sourceCanvas,
    targetX,
    targetY,
    targetWidth,
    targetHeight,
  )

  return new Promise((resolve, reject) => {
    outputCanvas.toBlob((blob) => {
      if (blob == null) {
        reject(new Error('아바타 이미지를 생성할 수 없습니다.'))
        return
      }

      resolve(blob)
    }, 'image/png')
  })
}

function showToast(
  showModal: ReturnType<typeof useModal>['showModal'],
  mode: 'success' | 'error',
  message: string,
) {
  showModal({
    key: MODAL_KEY.TOAST,
    component: <ToastModal mode={mode} message={message} />,
  })
}

function toSaveWearingAvatarRequest(avatar: WearingAvatar): SaveWearingNftAvatarRequest {
  return {
    fullSet: getTokenId(avatar.fullSet),
    upperClothing: getTokenId(avatar.upperClothing),
    lowerClothing: getTokenId(avatar.lowerClothing),
    footwear: getTokenId(avatar.footwear),
    face: getTokenId(avatar.face),
    skin: getTokenId(avatar.skin),
    hair: getTokenId(avatar.hair),
    accessories: {
      'head-accessories': getTokenId(avatar.accessories['head-accessories']),
      'eye-accessories': getTokenId(avatar.accessories['eye-accessories']),
      'ear-accessories': getTokenId(avatar.accessories['ear-accessories']),
      'body-accessories': getTokenId(avatar.accessories['body-accessories']),
    },
  }
}

/** token id는 ERC-1155 id(string)입니다. 숫자로 파싱하지 말고 string 그대로 전달합니다. */
function getTokenId(avatar: Avatar | null): string | null {
  if (avatar == null) return null

  return avatar.tokenId ?? avatar.id ?? null
}
