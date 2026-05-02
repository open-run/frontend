'use client'

import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import { parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs'
import Recommendation from '@components/home/Recommendation'
import { MagnifierIcon } from '@icons/magnifier'
import { colors } from '@styles/colors'
import ExploreSearch, { type SelectedExploreSearchTab } from './ExploreSearch'

const SEARCH_CATEGORY_QUERY_VALUES = ['ALL', 'NAME', 'MEMBER', 'HASHTAG', 'LOCATION'] as const

export default function Explore() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [{ keyword: searchKeyword, category: selectedTab }, setSearchParams] = useQueryStates(
    {
      keyword: parseAsString.withDefault(''),
      category: parseAsStringLiteral(SEARCH_CATEGORY_QUERY_VALUES).withDefault('ALL'),
    },
    {
      history: 'replace',
      shallow: true,
      clearOnDefault: true,
    },
  )
  const [isSearchActive, setIsSearchActive] = useState(() => searchKeyword.trim().length > 0)

  const trimmedSearchKeyword = searchKeyword.trim()
  const shouldShowRecommendation = !isSearchActive && trimmedSearchKeyword.length === 0
  const shouldShowSearchHint = isSearchActive && trimmedSearchKeyword.length < 2
  const shouldShowSearchResult = trimmedSearchKeyword.length >= 2

  useEffect(() => {
    if (trimmedSearchKeyword.length > 0) {
      setIsSearchActive(true)
    }
  }, [trimmedSearchKeyword])

  const setSearchKeyword = useCallback((keyword: string) => {
    setSearchParams({ keyword, category: 'ALL' })
  }, [setSearchParams])

  const setSelectedTab = useCallback((category: SelectedExploreSearchTab) => {
    setSearchParams({ category })
  }, [setSearchParams])

  const handleCancelSearch = () => {
    setSearchParams({ keyword: null, category: null })
    setIsSearchActive(false)
    inputRef.current?.blur()
  }

  return (
    <section className='h-full w-full bg-white'>
      <div className='px-16 pt-32 app:pt-72'>
        <h1 className='mb-16 text-28 font-bold'>탐색</h1>
        <div className='mb-24 flex items-center gap-8'>
          <label
            className={clsx(
              'active:scale-98 flex h-40 min-w-0 flex-1 items-center justify-between gap-8 rounded-8 border px-16 transition-colors active-press-duration',
              isSearchActive
                ? 'border-black-darken bg-white'
                : 'border-gray bg-white active:bg-gray/30',
            )}>
            <input
              ref={inputRef}
              className='min-w-0 flex-1 bg-transparent text-14 text-black outline-none placeholder:text-gray-darken'
              placeholder='벙 검색'
              value={searchKeyword}
              onFocus={() => setIsSearchActive(true)}
              onChange={(event) => setSearchKeyword(event.target.value)}
            />
            <MagnifierIcon size={16} color={colors.black.darken} />
          </label>
          {isSearchActive && (
            <button
              className='flex-shrink-0 rounded-8 px-8 py-4 text-14 active-press-duration active:scale-90 active:bg-gray/50'
              onClick={handleCancelSearch}>
              취소
            </button>
          )}
        </div>
      </div>
      <div className='h-[calc(100%-148px)] w-full overflow-y-auto pb-60'>
        {shouldShowRecommendation && <Recommendation />}
        {shouldShowSearchHint && <ExploreSearchHint />}
        {isSearchActive && shouldShowSearchResult && (
          <ExploreSearch
            searchKeyword={searchKeyword}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        )}
      </div>
    </section>
  )
}

function ExploreSearchHint() {
  return (
    <p className='mt-80 px-16 text-center text-14 leading-20 text-gray-darken'>
      두 글자 이상 입력하면 검색 결과가 표시됩니다
    </p>
  )
}
