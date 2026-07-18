import Image from 'next/image'

type ImageWarmupProps = {
  imageUrls: string[]
  width: number
  height: number
  sizes?: string
  limit?: number
}

export default function ImageWarmup({
  imageUrls,
  width,
  height,
  sizes = `${width}px`,
  limit = Infinity,
}: ImageWarmupProps) {
  const warmupImageUrls = imageUrls.slice(0, limit)

  if (warmupImageUrls.length === 0) return null

  return (
    <div
      aria-hidden='true'
      style={{
        position: 'fixed',
        left: -10_000,
        top: 0,
        width,
        height,
        overflow: 'hidden',
        opacity: 0,
        pointerEvents: 'none',
      }}>
      {warmupImageUrls.map((imageUrl) => (
        <Image
          key={imageUrl}
          src={imageUrl}
          alt=''
          width={width}
          height={height}
          sizes={sizes}
          // 보이지 않는 프리로드라 비율 보존이 필요 없으니 크기를 고정해 next/image 경고를 막는다
          style={{ width, height }}
          loading='eager'
          fetchPriority='low'
        />
      ))}
    </div>
  )
}
