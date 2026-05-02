import clsx from 'clsx'
import Image from 'next/image'
import { useState } from 'react'
import { RandomIcon } from '@icons/random'
import { colors } from '@styles/colors'

type BungThumbnailPickerProps = {
  value: string
  images: string[]
  onChange: (imageUrl: string) => void
  onRandom: () => void
  title?: string
  autoCollapseOnSelect?: boolean
}

export default function BungThumbnailPicker({
  value,
  images,
  onChange,
  onRandom,
  title = '배경 선택',
  autoCollapseOnSelect = true,
}: BungThumbnailPickerProps) {
  const [isGalleryOpen, setGalleryOpen] = useState(false)

  const selectedImage = value || images[0] || ''

  return (
    <section className='mb-32'>
      <div className='relative mx-auto h-184 w-full overflow-hidden rounded-8'>
        <Image className='object-cover' src={selectedImage} alt='Bung Background Image' fill />
        <button
          type='button'
          className='absolute bottom-16 right-16 rounded-4 bg-primary p-8 active-press-duration active:scale-90 active:bg-primary-darken'
          onClick={onRandom}
          aria-label='랜덤 배경 선택'>
          <RandomIcon size={24} color={colors.white} />
        </button>
        <button
          type='button'
          className='absolute bottom-16 left-16 rounded-full bg-black-darkest/65 px-12 py-6 text-12 font-semibold text-white backdrop-blur-sm active-press-duration active:scale-95'
          onClick={() => setGalleryOpen((prev) => !prev)}>
          {isGalleryOpen ? '배경 닫기' : '전체 배경 보기'}
        </button>
      </div>

      {isGalleryOpen && (
        <div className='mt-12 rounded-8 border border-gray bg-white p-12'>
          <div className='mb-10 flex items-center justify-between'>
            <span className='text-14 font-semibold text-black'>{title}</span>
            <span className='text-12 text-gray-darken'>{images.length}개</span>
          </div>

          <div className='grid grid-cols-3 gap-8 md:grid-cols-4'>
            {images.map((imageUrl, index) => {
              const isSelected = imageUrl === selectedImage

              return (
                <button
                  key={imageUrl}
                  type='button'
                  className='w-full text-left'
                  onClick={() => {
                    onChange(imageUrl)
                    if (autoCollapseOnSelect) setGalleryOpen(false)
                  }}>
                  <div
                    className={clsx(
                      'relative aspect-[16/9] w-full overflow-hidden rounded-8 border bg-gray-lighten active-press-duration active:scale-95',
                      isSelected ? 'border-primary ring-1 ring-primary/60' : 'border-gray',
                    )}>
                    <Image
                      className='object-cover'
                      src={imageUrl}
                      alt={`배경 ${index + 1}`}
                      fill
                      sizes='(max-width: 768px) 33vw, 25vw'
                    />
                    {isSelected && (
                      <span className='absolute right-6 top-6 rounded-full bg-primary px-6 py-2 text-[10px] font-bold text-white'>
                        선택됨
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
