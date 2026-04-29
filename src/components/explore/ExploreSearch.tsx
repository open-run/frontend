import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import { keepPreviousData } from '@tanstack/react-query'
import { BungInfo, BungMember } from '@type/bung'
import useDebounce from '@hooks/useDebounce'
import {
  BungSearchCategory,
  BungSearchCategoryResult,
  SearchBungsRequestType,
} from '@apis/v1/bungs/search'
import {
  useInfiniteSearchBungsQuery,
  useSearchBungsQuery,
} from '@apis/v1/bungs/search/query'
import { formatDate } from '@utils/time'
import { DEFAULT_PROFILE_IMAGE_URL } from '@constants/profile'

const SEARCH_PREVIEW_LIMIT = 5
const SEARCH_PAGE_LIMIT = 10

export type SelectedExploreSearchTab = 'ALL' | BungSearchCategory

export default function ExploreSearch({
  searchKeyword,
  selectedTab,
  setSelectedTab,
}: {
  searchKeyword: string
  selectedTab: SelectedExploreSearchTab
  setSelectedTab: (tab: SelectedExploreSearchTab) => void
}) {
  const debouncedKeyword = useDebounce(searchKeyword, 300)
  const normalizedSearchKeyword = debouncedKeyword.trim()
  const isKeywordValid = normalizedSearchKeyword.length >= 2

  const summaryQuery = useSearchBungsQuery(
    { keyword: normalizedSearchKeyword, limit: SEARCH_PREVIEW_LIMIT },
    { enabled: isKeywordValid, placeholderData: keepPreviousData },
  )

  const categoryResults = useMemo(
    () => (isKeywordValid ? summaryQuery.data?.data.categories ?? [] : []),
    [isKeywordValid, summaryQuery.data],
  )
  const displaySearchKeyword = summaryQuery.data?.data.keyword ?? normalizedSearchKeyword
  const isInitialSummaryLoading = isKeywordValid && !summaryQuery.isSuccess && summaryQuery.isFetching

  useEffect(() => {
    if (selectedTab === 'ALL') return
    if (!isKeywordValid || !summaryQuery.isSuccess) return
    if (summaryQuery.isPlaceholderData) return

    const hasSelectedCategory = categoryResults.some(({ category }) => category === selectedTab)
    if (!hasSelectedCategory) {
      setSelectedTab('ALL')
    }
  }, [categoryResults, isKeywordValid, selectedTab, setSelectedTab, summaryQuery.isPlaceholderData, summaryQuery.isSuccess])

  return (
    <div className='px-16 pb-120'>
      {isInitialSummaryLoading ? (
        <SearchInitialSkeleton />
      ) : (
        <>
          <SearchTabs
            selectedTab={selectedTab}
            isKeywordValid={isKeywordValid}
            categoryResults={categoryResults}
            setSelectedTab={setSelectedTab}
          />

          {selectedTab === 'ALL' ? (
            <SearchSummary
              searchKeyword={displaySearchKeyword}
              isKeywordValid={isKeywordValid}
              categoryResults={categoryResults}
              setSelectedTab={setSelectedTab}
            />
          ) : (
            <SearchCategoryResults
              searchKeyword={normalizedSearchKeyword}
              category={selectedTab}
              categoryLabel={getCategoryLabel(selectedTab, categoryResults)}
              isKeywordValid={isKeywordValid}
            />
          )}
        </>
      )}
    </div>
  )
}

function SearchTabs({
  selectedTab,
  isKeywordValid,
  categoryResults,
  setSelectedTab,
}: {
  selectedTab: SelectedExploreSearchTab
  isKeywordValid: boolean
  categoryResults: BungSearchCategoryResult[]
  setSelectedTab: (tab: SelectedExploreSearchTab) => void
}) {
  if (!isKeywordValid || categoryResults.length === 0) return null

  const tabs = [
    { key: 'ALL' as const, label: '전체' },
    ...categoryResults.map(({ category, label }) => ({ key: category, label })),
  ]

  return (
    <div className='-mx-16 mb-20 overflow-x-auto px-16'>
      <div className='flex w-max gap-8'>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={clsx(
              'h-32 rounded-full border px-14 text-14 font-bold transition-colors active-press-duration active:scale-95',
              tab.key === selectedTab
                ? 'border-black-darken bg-black-darken text-white'
                : 'border-gray bg-gray-lighten text-black hover:border-black-darken hover:bg-gray/60 active:bg-gray/70',
            )}
            onClick={() => setSelectedTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function SearchSummary({
  searchKeyword,
  isKeywordValid,
  categoryResults,
  setSelectedTab,
}: {
  searchKeyword: string
  isKeywordValid: boolean
  categoryResults: BungSearchCategoryResult[]
  setSelectedTab: (tab: SelectedExploreSearchTab) => void
}) {
  if (!isKeywordValid) return null
  if (categoryResults.length === 0) return <EmptyResult />

  return (
    <>
      {categoryResults.map((categoryResult) => (
        <section key={categoryResult.category} className='mb-32'>
          <div className='mb-8'>
            <p className='text-16 font-bold'>
              <span className='text-primary'>{searchKeyword}</span> {categoryResult.label} 검색 결과
            </p>
          </div>
          <div className='flex flex-col gap-8'>
            {categoryResult.data.map((item) => (
              <ExploreResult
                key={`${categoryResult.category}-${item.bungId}`}
                category={categoryResult.category}
                searchKeyword={searchKeyword}
                {...item}
              />
            ))}
          </div>
          {categoryResult.totalElements > categoryResult.data.length && (
            <button
              className='active:scale-98 mt-12 flex w-full items-center justify-center rounded-8 border border-dashed border-black py-12 text-14 font-bold transition-colors hover:border-black-darken hover:bg-gray-lighten active-press-duration active:bg-gray/50'
              onClick={() => setSelectedTab(categoryResult.category)}>
              {categoryResult.label} 더보기
            </button>
          )}
        </section>
      ))}
    </>
  )
}

function SearchCategoryResults({
  searchKeyword,
  category,
  categoryLabel,
  isKeywordValid,
}: {
  searchKeyword: string
  category: BungSearchCategory
  categoryLabel: string
  isKeywordValid: boolean
}) {
  const {
    data,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPlaceholderData,
  } = useInfiniteSearchBungsQuery(
    { keyword: searchKeyword, category, limit: SEARCH_PAGE_LIMIT },
    {
      enabled: isKeywordValid,
      placeholderData: (previousData, previousQuery) => {
        const previousRequest = previousQuery?.queryKey[2] as SearchBungsRequestType | undefined

        return previousRequest?.category === category ? previousData : undefined
      },
    },
  )
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  })

  useEffect(() => {
    if (isPlaceholderData) return

    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView, isPlaceholderData])

  if (!isKeywordValid) return null
  if (!isSuccess) return <SearchResultSkeleton />

  const list = data.pages.flatMap((page) => page.data.categories[0]?.data ?? [])
  const displaySearchKeyword = data.pages[0]?.data.keyword ?? searchKeyword
  if (list.length === 0) return <EmptyResult />

  return (
    <>
      <p className='mb-8 text-16 font-bold'>
        <span className='text-primary'>{displaySearchKeyword}</span> {categoryLabel} 검색 결과
      </p>
      <div className='mb-32 flex flex-col gap-8'>
        {list.map((item) => (
          <ExploreResult
            key={`${category}-${item.bungId}`}
            category={category}
            searchKeyword={displaySearchKeyword}
            {...item}
          />
        ))}
      </div>
      {isFetchingNextPage && <SearchResultSkeleton count={2} />}
      {hasNextPage && <div ref={ref} />}
    </>
  )
}

function ExploreResult({
  category,
  searchKeyword,
  bungId,
  name,
  mainImage,
  currentMemberCount,
  memberNumber,
  memberList,
  location,
  startDateTime,
  hashtags,
}: BungInfo & {
  category: BungSearchCategory
  searchKeyword: string
}) {
  const matchedMember = category === 'MEMBER' ? findMatchingMember(memberList, searchKeyword) : null
  const memberProfileImageUrl = matchedMember?.profileImageUrl || DEFAULT_PROFILE_IMAGE_URL

  return (
    <Link
      className='-mx-4 flex gap-16 rounded-8 px-4 py-6 transition-colors hover:bg-gray-lighten active-press-duration active:scale-[0.99] active:bg-gray/50'
      href={`/bung/${bungId}`}>
      <div className='relative h-94 w-140 flex-shrink-0'>
        <Image src={mainImage} alt={name} fill className='rounded-8 object-cover' />
        <div className='absolute left-8 top-8 rounded-4 bg-black/60 px-4'>
          <span className='mr-1 text-12 font-bold text-white'>{currentMemberCount}</span>
          <span className='text-12 tracking-[1px] text-gray-darken'>/{memberNumber}</span>
        </div>
        {category === 'MEMBER' && (
          <div className='absolute bottom-8 right-8 size-24'>
            <Image
              className='size-full object-contain'
              src={memberProfileImageUrl}
              alt={matchedMember?.nickname ?? 'member'}
              width={24}
              height={24}
            />
          </div>
        )}
      </div>
      <div className='flex flex-col pt-8'>
        <p className='mb-6 line-clamp-2 text-14 font-bold'>
          {category === 'NAME' ? renderHighlightKeyword(name, searchKeyword) : name}
        </p>
        <span className='line-clamp-1 text-12'>
          {category === 'LOCATION' ? renderHighlightKeyword(location, searchKeyword) : location}
        </span>
        <span className='mb-6 text-12'>
          {formatDate({ date: startDateTime, formatStr: 'M월 d일 (E) a h:mm', convertUTCtoLocale: true })}
        </span>
        {category === 'HASHTAG' &&
          hashtags.map((hashtag) => (
            <span key={hashtag} className='w-fit rounded-4 bg-black-darken px-4 py-2 text-12 text-white'>
              #{renderHighlightKeyword(hashtag, searchKeyword.replace(/^#+/, ''))}
            </span>
          ))}
      </div>
    </Link>
  )
}

function findMatchingMember(memberList: BungMember[], searchKeyword: string) {
  const lowerKeyword = searchKeyword.toLowerCase()
  return memberList.find((member) => member.nickname.toLowerCase().includes(lowerKeyword)) ?? null
}

function getCategoryLabel(category: BungSearchCategory, categoryResults: BungSearchCategoryResult[]) {
  return categoryResults.find((result) => result.category === category)?.label ?? CATEGORY_LABEL[category]
}

function renderHighlightKeyword(text: string, keyword: string) {
  if (keyword === '') return text

  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedKeyword})`, 'ig')

  return text.split(regex).map((part, index) => (
    part.toLowerCase() === keyword.toLowerCase()
      ? <span key={index} className='text-primary'>{part}</span>
      : <span key={index}>{part}</span>
  ))
}

function SearchResultSkeleton({ count = 4 }: { count?: number }) {
  return (
    <ul className='flex flex-col gap-8'>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} />
      ))}
    </ul>
  )
}

function SearchInitialSkeleton() {
  return (
    <>
      <div className='-mx-16 mb-20 overflow-hidden px-16'>
        <div className='flex gap-8'>
          <i className='h-32 w-60 flex-shrink-0 animate-pulse rounded-full bg-gray' />
          <i className='h-32 w-64 flex-shrink-0 animate-pulse rounded-full bg-gray' />
          <i className='h-32 w-88 flex-shrink-0 animate-pulse rounded-full bg-gray' />
        </div>
      </div>
      <i className='mb-24 block h-24 w-180 animate-pulse rounded-10 bg-gray' />
      <SearchResultSkeleton />
    </>
  )
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

const CATEGORY_LABEL: Record<BungSearchCategory, string> = {
  NAME: '이름',
  MEMBER: '멤버',
  HASHTAG: '해시태그',
  LOCATION: '위치',
}
