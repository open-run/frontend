import { useCallback } from 'react'
import { imageList } from '@store/image'

export function getNextImageUrl(currentImageUrl?: string | null, images: string[] = imageList) {
  if (images.length === 0) return ''

  const currentIndex = currentImageUrl ? images.indexOf(currentImageUrl) : -1
  const nextIndex = ((currentIndex >= 0 ? currentIndex : 0) + 1) % images.length
  return images[nextIndex]
}

export function useThumbnailImage(images: string[] = imageList) {
  const nextImage = useCallback(
    (currentImageUrl?: string | null) => {
      return getNextImageUrl(currentImageUrl, images)
    },
    [images],
  )

  return { nextImage }
}
