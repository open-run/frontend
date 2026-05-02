import Image from 'next/image'
import { DEFAULT_PROFILE_IMAGE_URL } from '@constants/profile'

export default function Avatar({
  size,
  imageSrc,
  className,
}: {
  size: number
  imageSrc: string | null | undefined
  className?: string
}) {
  const resolvedImageSrc = imageSrc || DEFAULT_PROFILE_IMAGE_URL

  return (
    <div
      className={`relative aspect-[1] shrink-0 ${className ?? ''}`}
      style={{ width: size }}>
      <Image className='size-full object-contain' src={resolvedImageSrc} alt='' width={size} height={size} />
    </div>
  )
}
