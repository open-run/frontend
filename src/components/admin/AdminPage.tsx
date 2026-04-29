'use client'

import clsx from 'clsx'
import { AxiosError } from 'axios'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AdminNftAvatarItem,
  AdminNftGrantResult,
  AdminUser,
  GrantAdminNftAvatarItemRequest,
} from '@apis/v1/admin'
import { useGrantAdminNftAvatarItemMutation } from '@apis/v1/admin/mutation'
import { useAdminMeQuery, useAdminNftAvatarItemsQuery, useAdminUsersQuery } from '@apis/v1/admin/query'
import { ApiResponse } from '@apis/type'
import { MainCategory, SubCategory } from '@type/avatar'
import RarityIcon from '@components/avatar/shared/RarityIcon'
import LoadingLogo from '@shared/LoadingLogo'
import { Dimmed, Popup } from '@shared/Modal'
import AdminAvatarTryOnPanel from './AdminAvatarTryOnPanel'

const FALLBACK_THUMBNAIL_URL = '/images/avatars/avatar_default_body.png'
type AdminMenuKey = 'grant' | 'avatarTryOn' | 'mint' | 'challenge'
type AdminCategoryFilterKey =
  | 'all'
  | 'upperClothing'
  | 'lowerClothing'
  | 'footwear'
  | 'face'
  | 'skin'
  | 'hair'
  | SubCategory

const CATEGORY_FILTERS: {
  key: AdminCategoryFilterKey
  label: string
  mainCategory?: MainCategory
  subCategory?: SubCategory
}[] = [
  { key: 'all', label: '전체' },
  { key: 'upperClothing', label: '상의', mainCategory: 'upperClothing' },
  { key: 'lowerClothing', label: '하의', mainCategory: 'lowerClothing' },
  { key: 'footwear', label: '신발', mainCategory: 'footwear' },
  { key: 'face', label: '얼굴', mainCategory: 'face' },
  { key: 'skin', label: '피부', mainCategory: 'skin' },
  { key: 'hair', label: '헤어', mainCategory: 'hair' },
  { key: 'head-accessories', label: '머리 장식', mainCategory: 'accessories', subCategory: 'head-accessories' },
  { key: 'eye-accessories', label: '눈 장식', mainCategory: 'accessories', subCategory: 'eye-accessories' },
  { key: 'ear-accessories', label: '귀 장식', mainCategory: 'accessories', subCategory: 'ear-accessories' },
  { key: 'body-accessories', label: '몸 장식', mainCategory: 'accessories', subCategory: 'body-accessories' },
]

export default function AdminPage() {
  const [activeMenu, setActiveMenu] = useState<AdminMenuKey>('grant')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedNftItemId, setSelectedNftItemId] = useState<number | null>(null)
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<AdminCategoryFilterKey>('all')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [grantResult, setGrantResult] = useState<AdminNftGrantResult | null>(null)

  const adminMeQuery = useAdminMeQuery()
  const isAdmin = adminMeQuery.data?.data.admin === true
  const isGrantMenu = activeMenu === 'grant'
  const adminUsersQuery = useAdminUsersQuery({
    enabled: isAdmin && isGrantMenu,
  })
  const nftAvatarItemsQuery = useAdminNftAvatarItemsQuery({
    enabled: isAdmin && isGrantMenu,
  })
  const grantMutation = useGrantAdminNftAvatarItemMutation()

  const adminUsers = useMemo(() => adminUsersQuery.data?.data ?? [], [adminUsersQuery.data])
  const nftAvatarItems = useMemo(() => nftAvatarItemsQuery.data?.data ?? [], [nftAvatarItemsQuery.data])
  const filteredNftAvatarItems = useMemo(
    () => filterNftAvatarItems(nftAvatarItems, selectedCategoryKey),
    [nftAvatarItems, selectedCategoryKey],
  )
  const selectedUser = useMemo(
    () => adminUsers.find((user) => user.userId === selectedUserId) ?? null,
    [adminUsers, selectedUserId],
  )
  const selectedItem = useMemo(
    () => nftAvatarItems.find((item) => item.nftItemId === selectedNftItemId) ?? null,
    [nftAvatarItems, selectedNftItemId],
  )
  const usersErrorMessage = getErrorMessage(adminUsersQuery.error)
  const listErrorMessage = getErrorMessage(nftAvatarItemsQuery.error)
  const grantErrorMessage = getErrorMessage(grantMutation.error)

  const handleGrant = () => {
    if (!selectedItem || !selectedUser) return

    const request: GrantAdminNftAvatarItemRequest = {
      recipientAddress: selectedUser.blockchainAddress,
      nftItemId: selectedItem.nftItemId,
    }

    grantMutation.mutate(request, {
      onSuccess: ({ data }) => {
        setGrantResult(data)
        setConfirmOpen(false)
      },
    })
  }

  if (adminMeQuery.isLoading) {
    return <AdminLoading />
  }

  if (!isAdmin) {
    return (
      <main className='h-full overflow-y-auto bg-gray-lighten px-16 py-40 app:pt-80'>
        <section className='mx-auto flex max-w-[720px] flex-col gap-16 rounded-8 bg-white p-24 shadow-floating-primary'>
          <h1 className='text-24 font-bold text-black'>OpenRun Admin</h1>
          <div className='rounded-8 border border-pink/30 bg-pink/10 p-16 text-14 font-bold text-pink'>
            접근 권한이 없습니다.
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className='h-full overflow-y-auto bg-gray-lighten px-16 pb-48 pt-24 app:pt-64'>
      <section className='mx-auto flex min-h-full max-w-[1040px] flex-col gap-16'>
        <header className='flex flex-col gap-12 rounded-8 bg-white p-20 shadow-floating-primary md:flex-row md:items-center md:justify-between'>
          <div>
            <h1 className='text-24 font-bold text-black'>OpenRun Admin</h1>
            <p className='mt-4 text-13 text-gray-darkest'>NFT 아바타 운영</p>
          </div>
          <AdminMenu activeMenu={activeMenu} onSelect={setActiveMenu} />
        </header>

        {activeMenu === 'grant' ? (
          <section className='grid gap-16 lg:grid-cols-[320px_1fr]'>
            <aside className='flex flex-col gap-16 rounded-8 bg-white p-16 shadow-floating-primary'>
              <h2 className='text-18 font-bold text-black'>NFT 부여</h2>

              <UserSelect
                users={adminUsers}
                selectedUser={selectedUser}
                selectedUserId={selectedUserId}
                isLoading={adminUsersQuery.isLoading}
                errorMessage={usersErrorMessage}
                onSelect={(userId) => {
                  setSelectedUserId(userId)
                  setGrantResult(null)
                }}
              />

              <SelectedItemPanel selectedItem={selectedItem} />

              <button
                type='button'
                className='active:scale-98 flex h-48 w-full items-center justify-center rounded-8 bg-primary text-15 font-bold text-white active-press-duration disabled:bg-gray disabled:text-gray-lighten'
                disabled={!selectedUser || !selectedItem || grantMutation.isPending}
                onClick={() => setConfirmOpen(true)}>
                {grantMutation.isPending ? <LoadingLogo className='w-120' /> : '부여하기'}
              </button>

              {grantErrorMessage && <p className='text-12 font-bold text-pink'>{grantErrorMessage}</p>}
              {grantResult && <GrantResult result={grantResult} />}
            </aside>

            <section className='rounded-8 bg-white p-16 shadow-floating-primary'>
              <div className='mb-12 flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
                <h2 className='text-18 font-bold text-black'>Mint 완료 NFT Item</h2>
                <span className='font-jost text-13 font-bold text-gray-darkest'>
                  {filteredNftAvatarItems.length} / {nftAvatarItems.length}
                </span>
              </div>

              <NftCategoryFilter selectedKey={selectedCategoryKey} onSelect={setSelectedCategoryKey} />

              {nftAvatarItemsQuery.isLoading ? (
                <div className='flex h-200 items-center justify-center'>
                  <LoadingLogo />
                </div>
              ) : listErrorMessage ? (
                <div className='rounded-8 border border-pink/30 bg-pink/10 p-16 text-14 font-bold text-pink'>
                  {listErrorMessage}
                </div>
              ) : (
                <NftItemGrid
                  items={filteredNftAvatarItems}
                  selectedNftItemId={selectedNftItemId}
                  emptyMessage={
                    selectedCategoryKey === 'all'
                      ? '부여 가능한 NFT Item이 없습니다.'
                      : '선택한 카테고리에 부여 가능한 NFT Item이 없습니다.'
                  }
                  onSelect={(item) => {
                    setSelectedNftItemId(item.nftItemId)
                    setGrantResult(null)
                  }}
                />
              )}
            </section>
          </section>
        ) : activeMenu === 'avatarTryOn' ? (
          <AdminAvatarTryOnPanel />
        ) : (
          <ComingSoonPanel title={activeMenu === 'mint' ? 'NFT 신규 민팅' : '도전과제 컨텐츠'} />
        )}
      </section>

      {confirmOpen && selectedItem && selectedUser && (
        <ConfirmGrantModal
          selectedUser={selectedUser}
          selectedItem={selectedItem}
          pending={grantMutation.isPending}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleGrant}
        />
      )}
    </main>
  )
}

function AdminMenu({
  activeMenu,
  onSelect,
}: {
  activeMenu: AdminMenuKey
  onSelect: (menu: AdminMenuKey) => void
}) {
  const menuItems: { key: AdminMenuKey; label: string }[] = [
    { key: 'grant', label: 'NFT 부여' },
    { key: 'avatarTryOn', label: '아바타 장착' },
    { key: 'mint', label: 'NFT 신규 민팅' },
    { key: 'challenge', label: '도전과제 컨텐츠' },
  ]

  return (
    <nav className='flex gap-8 overflow-x-auto'>
      {menuItems.map((item) => {
        const selected = item.key === activeMenu

        return (
          <button
            key={item.key}
            type='button'
            aria-pressed={selected}
            className={clsx(
              'h-36 flex-shrink-0 rounded-8 px-14 text-13 font-bold active-press-duration active:scale-95',
              selected ? 'bg-black text-white' : 'bg-gray text-gray-darkest hover:bg-gray-darken hover:text-black',
            )}
            onClick={() => onSelect(item.key)}>
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

function UserSelect({
  users,
  selectedUser,
  selectedUserId,
  isLoading,
  errorMessage,
  onSelect,
}: {
  users: AdminUser[]
  selectedUser: AdminUser | null
  selectedUserId: string | null
  isLoading: boolean
  errorMessage: string | null
  onSelect: (userId: string) => void
}) {
  const [keyword, setKeyword] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const normalizedKeyword = keyword.trim().toLowerCase()
  const filteredUsers = useMemo(() => {
    if (!normalizedKeyword) return users

    return users.filter((user) => {
      const nickname = getUserLabel(user).toLowerCase()
      const address = user.blockchainAddress.toLowerCase()
      return nickname.includes(normalizedKeyword) || address.includes(normalizedKeyword)
    })
  }, [normalizedKeyword, users])

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
    <section className='flex flex-col gap-8'>
      <span className='text-12 font-bold text-black-darken'>대상 유저</span>
      <div ref={dropdownRef} className='relative'>
        <button
          type='button'
          aria-expanded={isOpen}
          aria-haspopup='listbox'
          className={clsx(
            'flex min-h-48 w-full items-center justify-between gap-10 rounded-8 border px-12 py-8 text-left outline-none active-press-duration active:scale-[0.99]',
            isOpen ? 'border-primary' : 'border-gray hover:border-black/40',
          )}
          onClick={() => setIsOpen((current) => !current)}>
          {selectedUser ? (
            <span className='flex min-w-0 flex-col gap-2'>
              <span className='truncate text-14 font-bold text-black'>{getUserLabel(selectedUser)}</span>
              <span className='font-jost text-12 text-gray-darkest'>
                {formatAddress(selectedUser.blockchainAddress)}
              </span>
            </span>
          ) : (
            <span className='truncate text-14 font-bold text-gray-darkest'>대상 유저 선택</span>
          )}
          <span
            aria-hidden
            className={clsx(
              'h-8 w-8 flex-shrink-0 border-b-2 border-r-2 border-gray-darkest transition-transform',
              isOpen ? 'rotate-[225deg]' : 'rotate-45',
            )}
          />
        </button>

        {isOpen && (
          <div className='absolute left-0 right-0 top-full z-20 mt-6 overflow-hidden rounded-8 border border-gray bg-white shadow-floating-primary'>
            <div className='border-b border-gray p-8'>
              <input
                ref={searchInputRef}
                className='h-40 w-full rounded-8 border border-gray px-12 text-14 outline-none focus:border-primary'
                placeholder='닉네임 또는 address 검색'
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>
            <div className='max-h-220 overflow-y-auto' role='listbox'>
              {isLoading ? (
                <div className='flex h-120 items-center justify-center'>
                  <LoadingLogo className='w-120' />
                </div>
              ) : errorMessage ? (
                <div className='p-12 text-12 font-bold text-pink'>{errorMessage}</div>
              ) : filteredUsers.length === 0 ? (
                <div className='p-12 text-13 text-gray-darkest'>선택 가능한 유저가 없습니다.</div>
              ) : (
                filteredUsers.map((user) => {
                  const selected = user.userId === selectedUserId

                  return (
                    <button
                      key={user.userId}
                      type='button'
                      role='option'
                      aria-selected={selected}
                      className={clsx(
                        'flex w-full flex-col gap-2 border-b border-gray px-12 py-10 text-left last:border-b-0',
                        selected ? 'bg-primary/10' : 'bg-white hover:bg-gray-lighten',
                      )}
                      onClick={() => {
                        onSelect(user.userId)
                        setKeyword('')
                        setIsOpen(false)
                      }}>
                      <span className='truncate text-13 font-bold text-black'>{getUserLabel(user)}</span>
                      <span className='font-jost text-11 text-gray-darkest'>
                        {formatAddress(user.blockchainAddress)}
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>

      {selectedUser && (
        <section className='rounded-8 border border-gray p-12'>
          <span className='mb-6 block text-12 font-bold text-black-darken'>선택 유저</span>
          <p className='text-14 font-bold text-black'>{getUserLabel(selectedUser)}</p>
          <p className='mt-4 break-all font-jost text-12 text-gray-darkest'>{selectedUser.blockchainAddress}</p>
        </section>
      )}
    </section>
  )
}

function NftCategoryFilter({
  selectedKey,
  onSelect,
}: {
  selectedKey: AdminCategoryFilterKey
  onSelect: (key: AdminCategoryFilterKey) => void
}) {
  return (
    <nav className='mb-14 flex flex-wrap gap-6'>
      {CATEGORY_FILTERS.map((filter) => {
        const selected = filter.key === selectedKey

        return (
          <button
            key={filter.key}
            type='button'
            aria-pressed={selected}
            className={clsx(
              'h-32 rounded-8 px-10 text-12 font-bold active-press-duration active:scale-95',
              selected ? 'bg-black text-white' : 'bg-gray text-gray-darkest hover:bg-gray-darken hover:text-black',
            )}
            onClick={() => onSelect(filter.key)}>
            {filter.label}
          </button>
        )
      })}
    </nav>
  )
}

function ComingSoonPanel({ title }: { title: string }) {
  return (
    <section className='rounded-8 bg-white p-24 shadow-floating-primary'>
      <p className='text-18 font-bold text-black'>{title}</p>
      <div className='mt-16 rounded-8 bg-gray-lighten p-20 text-14 font-bold text-gray-darkest'>준비중입니다.</div>
    </section>
  )
}

function NftItemGrid({
  items,
  selectedNftItemId,
  emptyMessage,
  onSelect,
}: {
  items: AdminNftAvatarItem[]
  selectedNftItemId: number | null
  emptyMessage: string
  onSelect: (item: AdminNftAvatarItem) => void
}) {
  if (items.length === 0) {
    return <div className='py-80 text-center text-14 font-bold text-gray-darkest'>{emptyMessage}</div>
  }

  return (
    <div className='grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5'>
      {items.map((item) => {
        const selected = item.nftItemId === selectedNftItemId

        return (
          <button
            key={item.nftItemId}
            type='button'
            className={clsx(
              'active:scale-98 flex flex-col gap-8 rounded-8 border p-10 text-left active-press-duration',
              selected ? 'border-primary bg-primary/10' : 'border-gray bg-white hover:border-black/40',
            )}
            onClick={() => onSelect(item)}>
            <div className='relative aspect-square w-full rounded-8 bg-gray-lighten'>
              <Image
                src={item.thumbnailUrl ?? FALLBACK_THUMBNAIL_URL}
                alt={item.name}
                fill
                sizes='(max-width: 768px) 50vw, 160px'
                className='object-contain p-2'
              />
            </div>
            <div className='flex min-w-0 flex-col gap-6'>
              <div className='min-w-0'>
                <NftItemName item={item} iconSize={18} textClassName='text-13 font-bold text-black' />
                <p className='truncate font-jost text-11 text-gray-darkest'>
                  #{item.nftItemId} / {getCategoryLabel(item)}
                </p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function SelectedItemPanel({ selectedItem }: { selectedItem: AdminNftAvatarItem | null }) {
  return (
    <section className='rounded-8 border border-gray p-12'>
      <span className='mb-8 block text-12 font-bold text-black-darken'>선택 NFT</span>
      {selectedItem ? (
        <div className='flex items-center gap-12'>
          <div className='relative h-56 w-56 flex-shrink-0 rounded-8 bg-gray-lighten'>
            <Image
              src={selectedItem.thumbnailUrl ?? FALLBACK_THUMBNAIL_URL}
              alt={selectedItem.name}
              fill
              sizes='56px'
              className='object-contain'
            />
          </div>
          <div className='min-w-0'>
            <NftItemName item={selectedItem} iconSize={18} textClassName='text-14 font-bold text-black' />
            <p className='truncate font-jost text-12 text-gray-darkest'>
              {selectedItem.tokenId} / {getCategoryLabel(selectedItem)}
            </p>
          </div>
        </div>
      ) : (
        <p className='text-13 text-gray-darkest'>선택된 NFT Item이 없습니다.</p>
      )}
    </section>
  )
}

function NftItemName({
  item,
  iconSize,
  textClassName,
}: {
  item: AdminNftAvatarItem
  iconSize: number
  textClassName: string
}) {
  return (
    <p className={clsx('flex min-w-0 items-center gap-4', textClassName)}>
      {item.rarity !== 'common' && (
        <RarityIcon className='h-auto flex-shrink-0' rarity={item.rarity} size={iconSize} />
      )}
      <span className='min-w-0 truncate'>{item.name}</span>
    </p>
  )
}

function ConfirmGrantModal({
  selectedUser,
  selectedItem,
  pending,
  onCancel,
  onConfirm,
}: {
  selectedUser: AdminUser
  selectedItem: AdminNftAvatarItem
  pending: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <Dimmed onClick={onCancel}>
      <Popup className='p-20'>
        <section className='flex flex-col gap-16' onClick={(event) => event.stopPropagation()}>
          <h3 className='text-18 font-bold text-black'>NFT 부여 확인</h3>
          <div className='rounded-8 bg-gray-lighten p-12 text-13 text-black-darken'>
            <p className='font-bold'>{selectedItem.name}</p>
            <p className='mt-4 font-bold text-black'>{getUserLabel(selectedUser)}</p>
            <p className='mt-4 break-all font-jost'>{selectedUser.blockchainAddress}</p>
          </div>
          <div className='flex gap-8'>
            <button
              type='button'
              className='h-44 flex-1 rounded-8 bg-gray text-14 font-bold text-black active-press-duration active:scale-95'
              disabled={pending}
              onClick={onCancel}>
              취소
            </button>
            <button
              type='button'
              className='h-44 flex-1 rounded-8 bg-primary text-14 font-bold text-white active-press-duration active:scale-95 disabled:bg-gray'
              disabled={pending}
              onClick={onConfirm}>
              {pending ? '처리 중' : '확인'}
            </button>
          </div>
        </section>
      </Popup>
    </Dimmed>
  )
}

function GrantResult({ result }: { result: AdminNftGrantResult }) {
  return (
    <section className='rounded-8 border border-primary/30 bg-primary/10 p-12'>
      <p className='mb-6 text-13 font-bold text-primary-darken'>부여 완료</p>
      <p className='break-all font-jost text-12 text-black-darken'>{result.recipientAddress}</p>
      <p className='mt-4 break-all font-jost text-12 text-black-darken'>{result.transactionHash}</p>
    </section>
  )
}

function AdminLoading() {
  return (
    <main className='flex min-h-full items-center justify-center bg-gray-lighten'>
      <LoadingLogo />
    </main>
  )
}

function filterNftAvatarItems(items: AdminNftAvatarItem[], selectedKey: AdminCategoryFilterKey) {
  const selectedFilter = CATEGORY_FILTERS.find((filter) => filter.key === selectedKey)
  if (!selectedFilter || selectedFilter.key === 'all') return items

  return items.filter((item) => {
    if (selectedFilter.subCategory) {
      return item.mainCategory === selectedFilter.mainCategory && item.subCategory === selectedFilter.subCategory
    }

    return item.mainCategory === selectedFilter.mainCategory
  })
}

function getCategoryLabel(item: AdminNftAvatarItem) {
  return CATEGORY_FILTERS.find((filter) => {
    if (filter.subCategory) return item.subCategory === filter.subCategory
    return item.mainCategory === filter.mainCategory
  })?.label
}

function getUserLabel(user: AdminUser) {
  return user.nickname ?? '닉네임 없음'
}

function formatAddress(address: string) {
  if (address.length <= 12) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function getErrorMessage(error: Error | null): string | null {
  if (!error) return null

  const axiosError = error as AxiosError<ApiResponse<unknown>>
  return axiosError.response?.data.message ?? error.message
}
