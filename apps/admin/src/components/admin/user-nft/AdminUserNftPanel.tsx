'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AdminUser } from '@apis/v1/admin'
import { adminQueries, useAdminOwnedNftAvatarItemsQuery, useAdminUsersQuery } from '@apis/v1/admin/query'
import { useModal } from '@contexts/ModalProvider'
import { getApiErrorMessage } from '@openrun/api-client/error'
import { TransparentOpenrunIcon } from '@openrun/ui/icons/openrun'
import { colors } from '@openrun/ui/styles/colors'
import ToastModal from '@shared/ToastModal'
import { MODAL_KEY } from '@constants/modal'
import GrantNftDrawer from './GrantNftDrawer'
import OwnedNftGrid, { OwnedNftGridSkeleton } from './OwnedNftGrid'
import UserSelectDropdown from './UserSelectDropdown'

// 온체인 반영이 늦을 수 있어 발급 성공 후 잠시 뒤에 보유 목록을 재조회한다
const GRANT_REFRESH_DELAY_MS = 3000

export default function AdminUserNftPanel() {
  const queryClient = useQueryClient()
  const { showModal } = useModal()
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const refreshTimerRef = useRef<number | null>(null)
  const usersQuery = useAdminUsersQuery()
  const ownedItemsQuery = useAdminOwnedNftAvatarItemsQuery(selectedUser?.blockchainAddress ?? null)

  const users = useMemo(() => usersQuery.data?.data ?? [], [usersQuery.data])
  const ownedItems = useMemo(() => ownedItemsQuery.data?.data ?? [], [ownedItemsQuery.data])
  const ownedTokenIds = useMemo(
    () => new Set(ownedItems.map((item) => item.tokenId).filter((tokenId): tokenId is string => tokenId != null)),
    [ownedItems],
  )

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current != null) window.clearTimeout(refreshTimerRef.current)
    }
  }, [])

  const handleGrantSuccess = () => {
    const address = selectedUser?.blockchainAddress
    if (address == null) return

    showModal({
      key: MODAL_KEY.TOAST,
      component: <ToastModal mode='success' message='발급 완료. 잠시 후 목록을 갱신합니다.' />,
    })

    if (refreshTimerRef.current != null) window.clearTimeout(refreshTimerRef.current)
    refreshTimerRef.current = window.setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: adminQueries.ownedNftAvatarItems(address).queryKey })
    }, GRANT_REFRESH_DELAY_MS)
  }

  return (
    <section className='glass-panel rounded-16'>
      <div className='border-b border-black/[0.06] p-16'>
        <div className='mx-auto w-full max-w-[420px]'>
          <UserSelectDropdown
            users={users}
            selectedUser={selectedUser}
            isLoading={usersQuery.isLoading}
            errorMessage={usersQuery.error ? getErrorMessage(usersQuery.error) : null}
            onSelect={setSelectedUser}
          />
        </div>
      </div>

      <div className='min-h-[480px] rounded-b-16 bg-white/25 p-16'>
        {selectedUser === null ? (
          <EmptyContent message='유저를 선택하면 블록체인에서 보유 NFT를 조회합니다.' />
        ) : (
          <>
            <div className='mb-12 flex items-center justify-between'>
              <div className='flex items-center gap-8'>
                <h3 className='text-16 font-bold text-black'>보유 NFT</h3>
                {!ownedItemsQuery.isLoading && !ownedItemsQuery.error && (
                  <span className='font-jost text-12 font-bold text-[#6e6e73]'>{ownedItems.length}</span>
                )}
              </div>
              <button
                type='button'
                className='flex h-32 items-center rounded-full bg-[#4A5CEF] px-14 text-12 font-semibold text-white transition-colors active-press-duration active:scale-95 hover:bg-[#3D4CD9]'
                onClick={() => setIsDrawerOpen(true)}>
                NFT 발급하기
              </button>
            </div>

            {ownedItemsQuery.isLoading ? (
              <OwnedNftGridSkeleton />
            ) : ownedItemsQuery.error ? (
              <div className='rounded-12 border border-pink/25 bg-pink/[0.08] p-16 text-14 font-medium text-pink'>
                {getErrorMessage(ownedItemsQuery.error)}
              </div>
            ) : ownedItems.length === 0 ? (
              <EmptyContent message='보유한 NFT가 없습니다.' />
            ) : (
              <OwnedNftGrid ownedItems={ownedItems} />
            )}
          </>
        )}
      </div>

      {selectedUser && (
        <GrantNftDrawer
          open={isDrawerOpen}
          user={selectedUser}
          ownedTokenIds={ownedTokenIds}
          onClose={() => setIsDrawerOpen(false)}
          onGrantSuccess={handleGrantSuccess}
        />
      )}
    </section>
  )
}

function EmptyContent({ message }: { message: string }) {
  return (
    <div className='flex h-full min-h-[420px] flex-col items-center justify-center gap-16'>
      <TransparentOpenrunIcon size={96} color={colors.gray.darker} />
      <p className='text-14 font-medium text-[#6e6e73]'>{message}</p>
    </div>
  )
}

function getErrorMessage(error: Error): string {
  return getApiErrorMessage(error) ?? '보유 NFT를 불러오지 못했습니다.'
}
