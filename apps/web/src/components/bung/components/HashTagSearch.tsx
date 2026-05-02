import { useEffect, useState } from 'react'
import Input from '@shared/Input'
import useDebounce from '@hooks/useDebounce'
import { useHashtagsMutation } from '@apis/v1/bungs/hashtags/query'

export default function HashTagSearch({ onTagClick }: { onTagClick?: (tag: string) => void }) {
  const [inputValue, setInputValue] = useState('')
  const debouncedTag = useDebounce(inputValue, 300)
  const [recommendHashTags, setRecommendHashTags] = useState<string[]>([])

  const { mutate: fetchHashtags } = useHashtagsMutation()

  // 지연 적용 하기
  useEffect(() => {
    if (debouncedTag !== '') {
      fetchHashtags(
        { tag: debouncedTag },
        {
          onSuccess: ({ data }) => {
            const sliced = data.slice(0, 2)
            setRecommendHashTags([`${debouncedTag} (직접 입력)`, ...sliced])
          },
        },
      )
    } else {
      setRecommendHashTags([])
    }
  }, [debouncedTag, fetchHashtags])

  return (
    <div className='relative'>
      <Input type='text' placeholder='해시태그를 입력하세요' value={inputValue} setValue={setInputValue} />
      <ul className='absolute top-45 w-full overflow-hidden rounded-8 bg-white shadow-floating-primary'>
        {recommendHashTags.map((tag) => (
          <li
            key={tag}
            className='group block cursor-pointer py-10 pl-16 active-press-duration active:bg-gray/50'
            role='button'
            onClick={() => {
              onTagClick?.(tag.replace(' (직접 입력)', ''))
              setInputValue('')
            }}>
            <button className='text-14 text-black active-press-duration group-active:scale-95'>{tag}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
