import clsx from 'clsx'
import Image from 'next/image'
import { MouseEvent } from 'react'
import { Avatar } from '@openrun/types'
import { TransparentOpenrunIcon } from '@openrun/ui/icons/openrun'
import { colors } from '@openrun/ui/styles/colors'
import { hasThumbnailImage, hasWearableImage } from './wearingAvatar'

const FALLBACK_THUMBNAIL_IMAGE_URL = '/images/avatars/avatar_default_body.png'

type Props = {
  avatar: Avatar
  selected: boolean
  onToggle: () => void
  onHoverStart: (event: MouseEvent<HTMLElement>) => void
  onHoverEnd: () => void
}

export default function AvatarPartCard({ avatar, selected, onToggle, onHoverStart, onHoverEnd }: Props) {
  const showsThumbnail = hasThumbnailImage(avatar)
  const wearable = hasWearableImage(avatar)

  return (
    <button
      type='button'
      aria-pressed={selected}
      aria-disabled={!wearable}
      className={clsx(
        'relative flex w-full flex-col items-center gap-10 rounded-8 p-12 transition active-press-duration',
        !wearable
          ? 'cursor-not-allowed bg-white/25 opacity-60'
          : selected
            ? 'bg-[#4f8dff]/15 ring-2 ring-[#4f8dff]'
            : 'glass-inset hover:bg-white/85 active:scale-[0.98]',
      )}
      onClick={() => {
        if (!wearable) return
        onToggle()
      }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}>
      <div className='relative aspect-square w-full max-w-80'>
        {showsThumbnail ? (
          <Image
            alt={avatar.name}
            src={avatar.thumbnailUrl ?? FALLBACK_THUMBNAIL_IMAGE_URL}
            loading='lazy'
            fill
            sizes='(max-width: 768px) 33vw, 96px'
            className='object-contain'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center'>
            <TransparentOpenrunIcon size={56} color={colors.gray.darker} />
          </div>
        )}

        <MissingImageBadges showsThumbnail={showsThumbnail} wearable={wearable} />
      </div>

      <span className='w-full truncate text-center text-12 text-black-darken'>{avatar.name}</span>
    </button>
  )
}

function MissingImageBadges({ showsThumbnail, wearable }: { showsThumbnail: boolean; wearable: boolean }) {
  if (showsThumbnail && wearable) return null

  return (
    <div className='absolute left-0 top-0 flex gap-4'>
      {!showsThumbnail && (
        <span title='썸네일 없음' aria-label='썸네일 없음' className='text-black/60'>
          <MissingThumbnailIcon />
        </span>
      )}
      {!wearable && (
        <span title='장착 이미지 없음' aria-label='장착 이미지 없음' className='text-pink'>
          <MissingWearableIcon />
        </span>
      )}
    </div>
  )
}

function MissingThumbnailIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'>
      <rect x='3' y='3' width='18' height='18' rx='2' />
      <circle cx='8.5' cy='8.5' r='1.5' />
      <path d='m21 15-5-5-6 6' />
      <path d='m2 2 20 20' />
    </svg>
  )
}

function MissingWearableIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'>
      <path d='M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z' />
      <path d='m2 2 20 20' />
    </svg>
  )
}
