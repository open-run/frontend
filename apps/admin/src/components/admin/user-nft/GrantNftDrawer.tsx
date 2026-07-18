import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AdminNftAvatarItem, AdminUser } from '@apis/v1/admin'
import { useGrantAdminNftAvatarItemMutation } from '@apis/v1/admin/mutation'
import { useAdminNftAvatarItemsQuery } from '@apis/v1/admin/query'
import { getApiErrorMessage } from '@openrun/api-client/error'
import { RarityIcon } from '@openrun/ui'
import { TransparentOpenrunIcon } from '@openrun/ui/icons/openrun'
import { colors } from '@openrun/ui/styles/colors'
import { BrokenXIcon } from '@icons/x'
import { formatAddress } from '@utils/format'

type Props = {
  open: boolean
  user: AdminUser
  ownedTokenIds: Set<string>
  onClose: () => void
  onGrantSuccess: () => void
}

/** 유저에게 NFT를 발급하는 오른쪽 Drawer. body 포털로 렌더해 glass-panel의 containing block 문제를 피한다. */
export default function GrantNftDrawer({ open, user, ownedTokenIds, onClose, onGrantSuccess }: Props) {
  const [keyword, setKeyword] = useState('')
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null)
  const nftItemsQuery = useAdminNftAvatarItemsQuery({ enabled: open })
  const grantMutation = useGrantAdminNftAvatarItemMutation()

  const nftItems = useMemo(() => nftItemsQuery.data?.data ?? [], [nftItemsQuery.data])
  const filteredItems = useMemo(() => filterItems(nftItems, keyword), [keyword, nftItems])
  const selectedItem = useMemo(
    () => nftItems.find((item) => item.tokenId === selectedTokenId) ?? null,
    [nftItems, selectedTokenId],
  )
  const grantErrorMessage = grantMutation.error
    ? getApiErrorMessage(grantMutation.error) ?? '발급에 실패했습니다.'
    : null

  // 상태 초기화는 open 전환 시에만 — onClose(인라인 함수)가 deps에 있으면 부모 리렌더마다 진행 중 선택이 날아간다
  useEffect(() => {
    if (!open) return

    setKeyword('')
    setSelectedTokenId(null)
    grantMutation.reset()
    // grantMutation.reset은 안정 참조
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  const handleGrant = () => {
    if (!selectedItem || grantMutation.isPending) return
    if (!window.confirm(`${selectedItem.name}을(를) ${user.nickname ?? user.blockchainAddress}에게 발급할까요?`)) return

    grantMutation.mutate(
      { recipientAddress: user.blockchainAddress, tokenId: selectedItem.tokenId },
      {
        onSuccess: () => {
          onGrantSuccess()
          onClose()
        },
      },
    )
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className='fixed inset-0 z-modal'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}>
          <div className='absolute inset-0 bg-black/25' onClick={onClose} />

          <motion.aside
            className='absolute bottom-0 right-0 top-0 flex w-full max-w-[420px] flex-col rounded-l-[20px] bg-white/90 shadow-[-12px_0_40px_rgba(0,0,0,0.14)] backdrop-blur-[20px]'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 40 }}>
            <header className='flex items-center justify-between border-b border-black/[0.06] px-20 py-16'>
              <div className='min-w-0'>
                <h3 className='text-16 font-semibold text-[#1d1d1f]'>NFT 발급</h3>
                <p className='mt-2 truncate text-12 text-[#6e6e73]'>
                  {user.nickname ?? '닉네임 없음'} · {formatAddress(user.blockchainAddress)}
                </p>
              </div>
              <button
                type='button'
                aria-label='닫기'
                className='rounded-8 p-4 active-press-duration active:scale-90 hover:bg-black/[0.04]'
                onClick={onClose}>
                <BrokenXIcon size={22} color={colors.black.DEFAULT} />
              </button>
            </header>

            <div className='p-12'>
              <input
                className='h-40 w-full rounded-full bg-black/[0.05] px-14 text-14 text-[#1d1d1f] outline-none placeholder:text-[#6e6e73] focus:bg-black/[0.03] focus:ring-2 focus:ring-[#4A5CEF]'
                placeholder='NFT 이름 또는 카테고리 검색'
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>

            <div className='scrollbar-web-hidden min-h-0 flex-1 overflow-y-auto p-12'>
              {nftItemsQuery.isLoading ? (
                <GrantNftListSkeleton />
              ) : nftItemsQuery.error ? (
                <div className='rounded-12 border border-pink/25 bg-pink/[0.08] p-16 text-14 font-medium text-pink'>
                  NFT 목록을 불러오지 못했습니다.
                </div>
              ) : filteredItems.length === 0 ? (
                <p className='pt-40 text-center text-13 text-[#6e6e73]'>조건에 맞는 NFT가 없습니다.</p>
              ) : (
                <div className='grid grid-cols-4 gap-6'>
                  {filteredItems.map((item) => (
                    <GrantNftCard
                      key={item.tokenId}
                      item={item}
                      selected={item.tokenId === selectedTokenId}
                      owned={ownedTokenIds.has(item.tokenId)}
                      onSelect={() => setSelectedTokenId(item.tokenId)}
                    />
                  ))}
                </div>
              )}
            </div>

            <footer className='flex flex-col gap-8 border-t border-black/[0.06] p-16'>
              {grantErrorMessage && <p className='text-12 font-medium text-pink'>{grantErrorMessage}</p>}
              <button
                type='button'
                className='cta-gradient flex h-48 w-full items-center justify-center rounded-full text-15 font-bold text-white active:scale-[0.99] disabled:bg-gray disabled:bg-none disabled:text-gray-lighten disabled:shadow-none'
                disabled={!selectedItem || grantMutation.isPending}
                onClick={handleGrant}>
                {grantMutation.isPending ? '발급 중...' : selectedItem ? `${selectedItem.name} 발급하기` : '발급하기'}
              </button>
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function GrantNftCard({
  item,
  selected,
  owned,
  onSelect,
}: {
  item: AdminNftAvatarItem
  selected: boolean
  owned: boolean
  onSelect: () => void
}) {
  return (
    <button
      type='button'
      aria-pressed={selected}
      className={clsx(
        'relative flex w-full flex-col gap-4 rounded-8 p-6 text-left transition active-press-duration',
        selected ? 'bg-[#4A5CEF]/10 ring-2 ring-[#4A5CEF]' : 'hover:bg-black/[0.04] active:scale-[0.98]',
      )}
      onClick={onSelect}>
      <div className='relative aspect-square w-full rounded-8 bg-black/[0.04]'>
        {item.thumbnailUrl ? (
          <Image
            alt={item.name}
            src={item.thumbnailUrl}
            loading='lazy'
            fill
            sizes='120px'
            className='object-contain p-2'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center'>
            <TransparentOpenrunIcon size={36} color={colors.gray.darker} />
          </div>
        )}

        {owned && (
          <span className='absolute left-4 top-4 rounded-full bg-[#4A5CEF]/90 px-6 py-2 text-10 font-semibold text-white'>
            보유중
          </span>
        )}
      </div>

      <div className='min-w-0'>
        <p className='flex min-w-0 items-center gap-4 text-12 font-semibold text-[#1d1d1f]'>
          {item.rarity !== 'common' && <RarityIcon className='h-auto flex-shrink-0' rarity={item.rarity} size={16} />}
          <span className='min-w-0 truncate'>{item.name}</span>
        </p>
        <p className='truncate font-jost text-10 text-[#6e6e73]'>#{item.tokenId.slice(0, 8)}…</p>
      </div>
    </button>
  )
}

function GrantNftListSkeleton() {
  return (
    <div className='grid grid-cols-4 gap-6'>
      {Array.from({ length: 16 }).map((_, index) => (
        <div key={index} className='flex flex-col gap-4 rounded-8 p-6'>
          <div className='aspect-square w-full animate-pulse rounded-8 bg-black/[0.07]' />
          <div className='h-12 w-3/5 animate-pulse rounded-4 bg-black/[0.07]' />
          <div className='h-10 w-2/5 animate-pulse rounded-4 bg-black/[0.07]' />
        </div>
      ))}
    </div>
  )
}

function filterItems(items: AdminNftAvatarItem[], keyword: string): AdminNftAvatarItem[] {
  const normalizedKeyword = keyword.trim().toLowerCase()
  if (!normalizedKeyword) return items

  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(normalizedKeyword) ||
      item.category.toLowerCase().includes(normalizedKeyword) ||
      item.mainCategory.toLowerCase().includes(normalizedKeyword),
  )
}
