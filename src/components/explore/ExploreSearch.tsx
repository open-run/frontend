import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import Input from '@shared/Input'
import { ArrowRightIcon } from '@icons/arrow'
import { FilledThumbIcon } from '@icons/thumb'
import useDebounce from '@hooks/useDebounce'
import { useInfiniteSearchBungByHashtag } from '@apis/v1/bungs/hashtag/query'
import { useInfiniteSearchBungByLocation } from '@apis/v1/bungs/location/query'
import { useInfiniteSearchBungByNickname } from '@apis/v1/bungs/nickname/query'
import { formatDate } from '@utils/time'
import { DEFAULT_PROFILE_IMAGE_URL } from '@constants/profile'
import { colors } from '@styles/colors'

type Tab = '전체' | '멤버' | '해시태그' | '위치'

export default function ExploreSearch({ onCancelButtonClick }: { onCancelButtonClick: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedTab, setSelectedTab] = useState<Tab>('전체')
  const tabList: Tab[] = ['전체', '멤버', '해시태그', '위치']
  const [searchKeyword, setSearchKeyword] = useState('')
  const debouncedKeyword = useDebounce(searchKeyword, 300)

  // 페이지 첫 진입 시 입력란에 포커스
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <section className='h-full bg-white app:pt-50'>
      <div className='flex items-center gap-8 px-16 py-24'>
        <Input ref={inputRef} placeholder='벙 검색' value={searchKeyword} setValue={setSearchKeyword} />
        <button
          className='flex-shrink-0 rounded-8 px-8 py-4 text-14 active-press-duration active:scale-90 active:bg-gray/50'
          onClick={onCancelButtonClick}>
          취소
        </button>
      </div>

      <div className='w-full border-b border-gray pl-24'>
        {tabList.map((tab) => (
          <button
            key={tab}
            className={clsx(
              'px-16 pb-8 text-14 font-bold',
              tab === selectedTab && 'border-b-2 border-primary text-primary',
            )}
            onClick={() => setSelectedTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      <div className='h-[calc(100%-122px)] overflow-y-auto px-16 pb-120 pt-32'>
        {/* <p className='text-base mt-80 text-center text-gray-darken'>검색 결과가 없어요</p> */}
        {selectedTab === '전체' && <SearchTotal searchKeyword={debouncedKeyword} setSelectedTab={setSelectedTab} />}
        {selectedTab === '멤버' && <SearchMember searchKeyword={debouncedKeyword} />}
        {selectedTab === '해시태그' && <SearchHashtag searchKeyword={debouncedKeyword} />}
        {selectedTab === '위치' && <SearchLocation searchKeyword={debouncedKeyword} />}
      </div>
    </section>
  )
}

function SearchTotal({ searchKeyword, setSelectedTab }: { searchKeyword: string; setSelectedTab: (tab: Tab) => void }) {
  const isKeywordValid = searchKeyword !== '' && searchKeyword.length >= 2
  const { data: memberListData } = useInfiniteSearchBungByNickname(
    { nickname: searchKeyword },
    { enabled: isKeywordValid },
  )
  const { data: hashtagListData } = useInfiniteSearchBungByHashtag(
    { hashtag: searchKeyword },
    { enabled: isKeywordValid },
  )
  const { data: locationListData } = useInfiniteSearchBungByLocation(
    { location: searchKeyword },
    { enabled: isKeywordValid },
  )

  if (!isKeywordValid) return null

  const isSuccess = memberListData != null && hashtagListData != null && locationListData != null
  if (!isSuccess)
    return (
      <div>
        <div className='mb-8 h-24 w-full animate-pulse rounded-10 bg-gray' />
        <ul className='flex flex-col gap-8'>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} />
          ))}
        </ul>
      </div>
    )

  const memberList = memberListData.pages.flatMap((page) => page.data)
  const hashtagList = hashtagListData.pages.flatMap((page) => page.data)
  const locationList = locationListData.pages.flatMap((page) => page.data)
  const hasResult = memberList.length > 0 || hashtagList.length > 0 || locationList.length > 0

  return hasResult ? (
    <>
      {memberList.length > 0 && (
        <>
          <button className='mb-8 flex w-full items-center justify-between' onClick={() => setSelectedTab('멤버')}>
            <span className='text-16 font-bold'>
              <span className='text-primary'>{searchKeyword}</span>님이 참여 중인 모임
            </span>
            <ArrowRightIcon size={24} color={colors.black.darken} />
          </button>
          <div className='mb-32 flex flex-col gap-8'>
            {memberList.slice(0, 4).map((item, index) => (
              <ExploreResult key={index} mode='member' searchKeyword={searchKeyword} {...item} />
            ))}
          </div>
        </>
      )}

      {hashtagList.length > 0 && (
        <>
          <button className='mb-8 flex w-full items-center justify-between'>
            <span className='text-16 font-bold'>
              <span className='text-primary'>#{searchKeyword}</span> 해시태그가 달린 모임
            </span>
            <ArrowRightIcon size={24} color={colors.black.darken} />
          </button>
          <div className='mb-32 flex flex-col gap-8'>
            {hashtagList.slice(0, 4).map((item, index) => (
              <ExploreResult key={index} mode='hashtag' searchKeyword={searchKeyword} {...item} />
            ))}
          </div>
        </>
      )}

      {locationList.length > 0 && (
        <>
          <button className='mb-8 flex w-full items-center justify-between'>
            <span className='text-16 font-bold'>
              <span className='text-primary'>{searchKeyword}</span>에서 열리는 러닝
            </span>
            <ArrowRightIcon size={24} color={colors.black.darken} />
          </button>
          <div className='flex flex-col gap-8'>
            {locationList.slice(0, 4).map((item, index) => (
              <ExploreResult key={index} mode='location' searchKeyword={searchKeyword} {...item} />
            ))}
          </div>
        </>
      )}
    </>
  ) : (
    <EmptyResult />
  )
}

function SearchMember({ searchKeyword }: { searchKeyword: string }) {
  const isKeywordValid = searchKeyword !== '' && searchKeyword.length >= 2
  const {
    data: memberList,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSearchBungByNickname({ nickname: searchKeyword }, { enabled: isKeywordValid })
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  if (!isKeywordValid) return null
  if (!isSuccess)
    return (
      <div>
        <div className='mb-8 h-24 w-full animate-pulse rounded-10 bg-gray' />
        <ul className='flex flex-col gap-8'>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} />
          ))}
        </ul>
      </div>
    )

  const list = memberList.pages.flatMap((page) => page.data)
  const targetMember = (() => {
    let member = null
    for (const item of list) {
      if (member != null) break
      member = item.memberList.find((member) => member.nickname.includes(searchKeyword)) ?? null
    }
    return member
  })()

  return list.length > 0 ? (
    <>
      {targetMember != null && (
        <div className='mb-16 flex items-center'>
          <div className='size-[76px] shrink-0'>
            <Image
              className='size-full object-contain'
              src={targetMember.profileImageUrl || DEFAULT_PROFILE_IMAGE_URL}
              alt={targetMember.nickname}
              width={76}
              height={76}
            />
          </div>
          <div className='ml-12'>
            <p className='mb-2 text-20 font-bold'>{targetMember.nickname}</p>
            <p className='flex items-center gap-4 font-jost text-16 font-black italic'>
              <FilledThumbIcon size={16} color={colors.black.DEFAULT} />
              <span>{300}</span>
            </p>
          </div>
        </div>
      )}
      <p className='mb-8 text-16 font-bold'>
        <span className='text-primary'>{searchKeyword}</span>님이 참여 중인 모임
      </p>
      <div className='mb-32 flex flex-col gap-8'>
        {list.map((item, index) => (
          <ExploreResult key={index} mode='member' searchKeyword={searchKeyword} {...item} />
        ))}
      </div>
      {isFetchingNextPage && (
        <ul className='flex flex-col gap-8'>
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} />
          ))}
        </ul>
      )}
      {hasNextPage && <div ref={ref} />}
    </>
  ) : (
    <EmptyResult />
  )
}

function SearchHashtag({ searchKeyword }: { searchKeyword: string }) {
  const isKeywordValid = searchKeyword !== '' && searchKeyword.length >= 2
  const {
    data: hashtagList,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSearchBungByHashtag({ hashtag: searchKeyword }, { enabled: isKeywordValid })
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  if (!isKeywordValid) return null
  if (!isSuccess)
    return (
      <div>
        <div className='mb-8 h-24 w-full animate-pulse rounded-10 bg-gray' />
        <ul className='flex flex-col gap-8'>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} />
          ))}
        </ul>
      </div>
    )

  const list = hashtagList.pages.flatMap((page) => page.data)
  return list.length > 0 ? (
    <>
      <p className='mb-8 text-16 font-bold'>
        <span className='text-primary'>#{searchKeyword}</span> 해시태그가 달린 모임
      </p>
      <div className='mb-32 flex flex-col gap-8'>
        {list.map((item, index) => (
          <ExploreResult key={index} mode='hashtag' searchKeyword={searchKeyword} {...item} />
        ))}
      </div>
      {isFetchingNextPage && (
        <ul className='flex flex-col gap-8'>
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} />
          ))}
        </ul>
      )}
      {hasNextPage && <div ref={ref} />}
    </>
  ) : (
    <EmptyResult />
  )
}

function SearchLocation({ searchKeyword }: { searchKeyword: string }) {
  const isKeywordValid = searchKeyword !== '' && searchKeyword.length >= 2
  const {
    data: locationList,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSearchBungByLocation({ location: searchKeyword }, { enabled: isKeywordValid })
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  if (!isKeywordValid) return null
  if (!isSuccess)
    return (
      <div>
        <div className='mb-8 h-24 w-full animate-pulse rounded-10 bg-gray' />
        <ul className='flex flex-col gap-8'>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} />
          ))}
        </ul>
      </div>
    )

  const list = locationList.pages.flatMap((page) => page.data)
  return list.length > 0 ? (
    <>
      <p className='mb-8 text-16 font-bold'>
        <span className='text-primary'>#{searchKeyword}</span>에서 열리는 러닝
      </p>
      <div className='mb-32 flex flex-col gap-8'>
        {list.map((item, index) => (
          <ExploreResult key={index} mode='hashtag' searchKeyword={searchKeyword} {...item} />
        ))}
      </div>
      {isFetchingNextPage && (
        <ul className='flex flex-col gap-8'>
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} />
          ))}
        </ul>
      )}
      {hasNextPage && <div ref={ref} />}
    </>
  ) : (
    <EmptyResult />
  )
}

function ExploreResult({
  mode,
  searchKeyword,
  bungId,
  name,
  mainImage,
  currentMemberCount,
  memberNumber,
  location,
  startDateTime,
  hashtags,
}: {
  mode: 'member' | 'hashtag' | 'location'
  searchKeyword: string
  bungId: string
  name: string
  mainImage: string
  currentMemberCount: number
  memberNumber: number
  location: string
  startDateTime: string
  hashtags: string[]
}) {
  return (
    <Link className='flex gap-16' href={`/bung/${bungId}`}>
      <div className='relative h-94 w-140 flex-shrink-0'>
        <Image src={mainImage} alt={name} fill className='rounded-8 object-cover' />
        <div className='absolute left-8 top-8 rounded-4 bg-black/60 px-4'>
          <span className='mr-1 text-12 font-bold text-white'>{currentMemberCount}</span>
          <span className='text-12 tracking-[1px] text-gray-darken'>/{memberNumber}</span>
        </div>
        {mode === 'member' && (
          <div className='absolute bottom-8 right-8 size-24'>
            <Image
              className='size-full object-contain'
              src={DEFAULT_PROFILE_IMAGE_URL}
              alt='location'
              width={24}
              height={24}
            />
          </div>
        )}
      </div>
      <div className='flex flex-col pt-8'>
        <p className='mb-6 line-clamp-2 text-14 font-bold'>{name}</p>
        <span className='line-clamp-1 text-12'>
          {mode === 'location' ? renderHighlightKeyword(location, searchKeyword) : location}
        </span>
        <span className='mb-6 text-12'>
          {formatDate({ date: startDateTime, formatStr: 'M월 d일 (E) a h:mm', convertUTCtoLocale: true })}
        </span>
        {mode === 'hashtag' &&
          hashtags.map((hashtag) => (
            <span key={hashtag} className='w-fit rounded-4 bg-black-darken px-4 py-2 text-12 text-white'>
              {hashtag}
            </span>
          ))}
      </div>
    </Link>
  )
}

const renderHighlightKeyword = (text: string, keyword: string) => {
  if (keyword === '') return text

  const parts = text.split(keyword)
  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 && <span className='text-primary'>{keyword}</span>}
    </span>
  ))
}

function Skeleton() {
  return (
    <div className='flex gap-16'>
      <i className='h-94 w-140 flex-shrink-0 animate-pulse rounded-10 bg-gray' />
      <div className='flex w-full flex-col'>
        <i className='mb-6 h-20 w-120 animate-pulse rounded-10 bg-gray' />
        <i className='mb-4 h-16 w-[80%] animate-pulse rounded-10 bg-gray' />
        <i className='h-16 w-120 animate-pulse rounded-10 bg-gray' />
      </div>
    </div>
  )
}

function EmptyResult() {
  return <div className='mt-80 text-center text-16 text-gray-darken'>검색 결과가 없어요</div>
}
