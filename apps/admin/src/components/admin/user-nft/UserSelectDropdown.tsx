import clsx from 'clsx'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AdminUser } from '@apis/v1/admin'
import { formatAddress } from '@utils/format'

type Props = {
  users: AdminUser[]
  selectedUser: AdminUser | null
  isLoading: boolean
  errorMessage: string | null
  onSelect: (user: AdminUser) => void
}

export default function UserSelectDropdown({ users, selectedUser, isLoading, errorMessage, onSelect }: Props) {
  const [keyword, setKeyword] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const filteredUsers = useMemo(() => filterUsers(users, keyword), [keyword, users])

  useEffect(() => {
    if (!isOpen) return

    searchInputRef.current?.focus()

    const handlePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className='relative'>
      <button
        type='button'
        aria-expanded={isOpen}
        aria-haspopup='listbox'
        className={clsx(
          'glass-inset flex min-h-48 w-full items-center justify-between gap-10 rounded-16 px-14 py-8 text-left outline-none active-press-duration active:scale-[0.99]',
          isOpen ? 'ring-2 ring-[#4A5CEF]' : 'hover:bg-white/80',
        )}
        onClick={() => setIsOpen((current) => !current)}>
        {selectedUser ? (
          <span className='flex min-w-0 flex-col gap-2'>
            <span className='truncate text-14 font-semibold text-[#1d1d1f]'>{getUserLabel(selectedUser)}</span>
            <span className='font-jost text-12 text-[#6e6e73]'>{formatAddress(selectedUser.blockchainAddress)}</span>
          </span>
        ) : (
          <span className='truncate text-14 font-medium text-[#6e6e73]'>조회할 유저 선택</span>
        )}
        <span
          aria-hidden
          className={clsx(
            'h-8 w-8 flex-shrink-0 border-b-2 border-r-2 border-[#6e6e73] transition-transform',
            isOpen ? 'rotate-[225deg]' : 'rotate-45',
          )}
        />
      </button>

      {isOpen && (
        <div className='glass-panel absolute left-0 right-0 top-full z-20 mt-6 overflow-hidden rounded-16'>
          <div className='border-b border-black/[0.06] p-8'>
            <input
              ref={searchInputRef}
              className='glass-inset h-40 w-full rounded-full px-14 text-14 text-[#1d1d1f] outline-none placeholder:text-[#6e6e73] focus:ring-2 focus:ring-[#4A5CEF]'
              placeholder='닉네임 또는 address 검색'
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>
          <div className='scrollbar-web-hidden max-h-[320px] overflow-y-auto' role='listbox'>
            {isLoading ? (
              <UserOptionSkeleton />
            ) : errorMessage ? (
              <p className='p-12 text-12 font-medium text-pink'>{errorMessage}</p>
            ) : filteredUsers.length === 0 ? (
              <p className='p-12 text-13 text-[#6e6e73]'>선택 가능한 유저가 없습니다.</p>
            ) : (
              filteredUsers.map((user) => {
                const selected = user.userId === selectedUser?.userId

                return (
                  <button
                    key={user.userId}
                    type='button'
                    role='option'
                    aria-selected={selected}
                    className={clsx(
                      'flex w-full flex-col gap-2 border-b border-black/[0.06] px-14 py-10 text-left last:border-b-0',
                      selected ? 'bg-[#4A5CEF]/10' : 'hover:bg-white/70',
                    )}
                    onClick={() => {
                      onSelect(user)
                      setKeyword('')
                      setIsOpen(false)
                    }}>
                    <span className='truncate text-13 font-semibold text-[#1d1d1f]'>{getUserLabel(user)}</span>
                    <span className='font-jost text-11 text-[#6e6e73]'>{formatAddress(user.blockchainAddress)}</span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function UserOptionSkeleton() {
  return (
    <div className='flex flex-col gap-8 p-12'>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className='flex flex-col gap-4'>
          <span className='h-13 w-3/5 animate-pulse rounded-4 bg-white/70' />
          <span className='h-11 w-2/5 animate-pulse rounded-4 bg-white/70' />
        </div>
      ))}
    </div>
  )
}

function filterUsers(users: AdminUser[], keyword: string): AdminUser[] {
  const normalizedKeyword = keyword.trim().toLowerCase()
  if (!normalizedKeyword) return users

  return users.filter((user) => {
    const nickname = getUserLabel(user).toLowerCase()
    const address = user.blockchainAddress.toLowerCase()
    return nickname.includes(normalizedKeyword) || address.includes(normalizedKeyword)
  })
}

function getUserLabel(user: AdminUser): string {
  return user.nickname ?? '닉네임 없음'
}
