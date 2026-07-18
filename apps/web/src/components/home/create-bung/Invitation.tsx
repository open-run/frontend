'use client'

import { queryOptions, useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Input from '@shared/Input'
import PrimaryButton from '@shared/PrimaryButton'
import Spacing from '@shared/Spacing'
import { CheckIcon } from '@icons/check'
import { MagnifierIcon } from '@icons/magnifier'
import { BrokenXIcon } from '@icons/x'
import useDebounce from '@hooks/useDebounce'
import useAppInsetSize, { useAppInsetValue } from '@hooks/useAppInsetSize'
import { useSearchByNicknameMutation } from '@apis/v1/users/nickname/query'
import { fetchSuggestion } from '@apis/v1/users/suggestion'
import { DEFAULT_PROFILE_IMAGE_URL } from '@constants/profile'
import { colors } from '@styles/colors'

const suggestionQueries = {
  list: () =>
    queryOptions({
      queryKey: ['/users/suggestion'] as const,
      queryFn: () => fetchSuggestion({ page: 0, limit: 10 }),
    }),
}

export default function Invitation() {
  const { mutate: searchByNickname, data: searchedList } = useSearchByNicknameMutation()
  const bottomInset = useAppInsetValue('bottom')
  const buttonBottom = useAppInsetSize('bottom', 20)
  const [selectedMembers, setSelectedMembers] = useState<
    {
      userId: string
      nickname: string
    }[]
  >([])

  /* 멤버 추천 관련 */
  const { data: suggestionList } = useQuery(suggestionQueries.list())

  const renderSuggestionList = () => {
    if (suggestionList == null) return null
    if (suggestionList.data.length === 0)
      return <div className='mt-20 text-center text-14 text-gray'>아직 함께했던 멤버가 없습니다.</div>
    return suggestionList.data.map(({ userId, nickname, profileImageUrl }) => (
      <Member
        key={userId}
        imageUrl={profileImageUrl || DEFAULT_PROFILE_IMAGE_URL}
        isRecommend
        name={nickname}
        isSelected={selectedMembers.some((member) => member.userId === userId)}
        onInvite={(isInvited) => {
          setSelectedMembers((prev) =>
            isInvited ? [...prev, { userId, nickname }] : prev.filter((member) => member.userId !== userId),
          )
        }}
      />
    ))
  }
  /* -------- */

  /* 멤버 검색 관련 */
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (debouncedSearch) {
      searchByNickname({ nickname: debouncedSearch })
    }
  }, [debouncedSearch]) // eslint-disable-line react-hooks/exhaustive-deps

  const renderSearchedList = () => {
    if (searchedList == null) return null
    if (searchedList.data.length === 0)
      return <div className='mt-20 text-center text-14 text-gray'>검색 결과가 없습니다.</div>
    return searchedList.data.map(({ userId, nickname, profileImageUrl }) => (
      <Member
        key={userId}
        imageUrl={profileImageUrl || DEFAULT_PROFILE_IMAGE_URL}
        isRecommend={false}
        name={nickname}
        isSelected={selectedMembers.some((member) => member.userId === userId)}
        onInvite={(isInvited) => {
          setSelectedMembers((prev) =>
            isInvited ? [...prev, { userId, nickname }] : prev.filter((member) => member.userId !== userId),
          )
        }}
      />
    ))
  }
  /* -------- */

  const 멤버추천리스트를보여줄상태인가 = debouncedSearch === ''

  return (
    <section className='scrollbar-web-hidden relative flex h-full w-full flex-col overflow-y-auto px-16'>
      <Spacing size={16} />
      <Input
        className='pr-40'
        type='text'
        placeholder='닉네임을 검색하세요'
        value={search}
        setValue={setSearch}
        addon={
          <MagnifierIcon
            className='absolute bottom-1/2 right-16 translate-y-1/2'
            size={16}
            color={colors.black.darken}
          />
        }
      />
      <Spacing size={16} />
      <div className='w-full'>
        <ul className='flex h-28 items-center gap-8 overflow-x-auto'>
          {selectedMembers.map((member) => (
            <li key={member.userId} className='shrink-0'>
              <SelectedMember
                nickname={member.nickname}
                onClose={() => {
                  setSelectedMembers((prev) => prev.filter(({ userId }) => userId !== member.userId))
                }}
              />
            </li>
          ))}
        </ul>
      </div>
      <Spacing size={32} />
      <ul
        className='scrollbar-web-hidden flex h-[calc(100%-160px)] flex-col gap-8 overflow-y-auto pb-20 pr-8'
        style={{ height: `calc(100% - ${160 + bottomInset}px)` }}>
        {멤버추천리스트를보여줄상태인가 ? renderSuggestionList() : renderSearchedList()}
      </ul>
      <div className='absolute w-[calc(100%-32px)] bottom-20' style={{ bottom: buttonBottom }}>
        <PrimaryButton disabled={selectedMembers.length === 0}>초대 완료</PrimaryButton>
      </div>
    </section>
  )
}

function Member({
  imageUrl,
  isRecommend,
  name,
  isSelected,
  onInvite,
}: {
  imageUrl: string
  isRecommend: boolean
  name: string
  isSelected: boolean
  onInvite?: (isInvited: boolean) => void
}) {
  return (
    <li>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-16'>
          <Image className='rounded-8 bg-black-darken object-contain' src={imageUrl} alt='' width={76} height={76} />
          <div className='flex flex-col gap-4'>
            {isRecommend && <span className='w-fit rounded-4 bg-gray px-4 py-2 text-12 text-black-darken'>추천</span>}
            <span className='text-14 font-bold text-black-darken'>{name}</span>
          </div>
        </div>
        {isSelected === false ? (
          <button
            className='flex h-24 w-67 items-center justify-center rounded-12 bg-black-darken text-12 text-white'
            onClick={() => {
              onInvite?.(true)
            }}>
            초대하기
          </button>
        ) : (
          <button
            className='flex h-24 w-67 items-center justify-center gap-2 rounded-12 bg-primary text-12 text-white'
            onClick={() => {
              onInvite?.(false)
            }}>
            선택
            <CheckIcon size={16} color={colors.white} />
          </button>
        )}
      </div>
    </li>
  )
}

function SelectedMember({ nickname, onClose }: { nickname: string; onClose: () => void }) {
  return (
    <div className='flex w-fit shrink-0 items-center gap-8 rounded-4 bg-gray px-8 py-4'>
      <span className='text-14 font-bold'>{nickname}</span>
      <button onClick={onClose}>
        <BrokenXIcon size={16} color={colors.black.DEFAULT} />
      </button>
    </div>
  )
}
