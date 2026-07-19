'use client'

import { ChangeEvent, useRef } from 'react'
import { WearingAvatar } from '@openrun/types'
import { Avatar as AvatarComponent } from '@openrun/ui'
import { TransparentOpenrunIcon } from '@openrun/ui/icons/openrun'
import { ResetIcon } from '@openrun/ui/icons/reset'
import { colors } from '@openrun/ui/styles/colors'
import { AVATAR_IMAGE_SIZES } from './constants'
import { useLocalImagePreview } from './useLocalImagePreview'

type Props = {
  wearingAvatar: WearingAvatar
  onReset: () => void
}

export default function AvatarPreviewBoard({ wearingAvatar, onReset }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadedImage = useLocalImagePreview()

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) uploadedImage.showImage(file)
    // 같은 파일을 다시 선택해도 change 이벤트가 발생하도록 초기화
    event.target.value = ''
  }

  const handleReset = () => {
    uploadedImage.clearImage()
    onReset()
  }

  return (
    <div className='relative mx-auto flex h-248 w-full max-w-[380px] justify-center rounded-16 bg-black-darken'>
      <TransparentOpenrunIcon
        className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        size={160}
        color={colors.white}
      />
      <AvatarComponent className='absolute top-16 h-270 w-216 flex-shrink-0' sizes={AVATAR_IMAGE_SIZES} {...wearingAvatar} />

      {uploadedImage.imageUrl && (
        // 로컬 미리보기(blob URL)라 next/image 최적화 대상이 아니다
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={uploadedImage.imageUrl}
          alt='업로드한 장착 이미지 미리보기'
          className='pointer-events-none absolute left-1/2 top-16 h-270 w-216 -translate-x-1/2 object-contain'
        />
      )}

      <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={handleFileChange} />
      <PreviewBoardButton label='장착 이미지 업로드' className='bottom-52' onClick={() => fileInputRef.current?.click()}>
        <UploadImageIcon />
      </PreviewBoardButton>
      <PreviewBoardButton label='아바타 초기화' className='bottom-8' onClick={handleReset}>
        <ResetIcon />
      </PreviewBoardButton>
    </div>
  )
}

function PreviewBoardButton({
  label,
  className,
  onClick,
  children,
}: {
  label: string
  className: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type='button'
      aria-label={label}
      title={label}
      className={`absolute right-8 z-10 flex h-36 w-36 items-center justify-center rounded-full bg-white/90 active-press-duration active:scale-90 hover:bg-white ${className}`}
      onClick={onClick}>
      {children}
    </button>
  )
}

function UploadImageIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className='text-black-darken'>
      <rect x='3' y='3' width='18' height='18' rx='2' />
      <circle cx='8.5' cy='8.5' r='1.5' />
      <path d='m21 15-5-5L5 21' />
    </svg>
  )
}
