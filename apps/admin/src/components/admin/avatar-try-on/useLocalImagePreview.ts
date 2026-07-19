import { useEffect, useRef, useState } from 'react'

/** 로컬 파일을 object URL로 바꿔 미리보기로 쓰고, 교체/해제/언마운트 시 URL을 회수한다. */
export function useLocalImagePreview() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const imageUrlRef = useRef<string | null>(null)
  imageUrlRef.current = imageUrl

  useEffect(() => {
    return () => {
      if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
    }
  }, [])

  const replaceImageUrl = (nextUrl: string | null) => {
    setImageUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl)
      return nextUrl
    })
  }

  const showImage = (file: File) => replaceImageUrl(URL.createObjectURL(file))
  const clearImage = () => replaceImageUrl(null)

  return { imageUrl, showImage, clearImage }
}
