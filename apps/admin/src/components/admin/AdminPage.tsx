'use client'

import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useDisconnect } from '@reown/appkit/react'
import { COOKIE } from '@openrun/api-client/constants'
import { removeCookie } from '@openrun/api-client/cookie'
import AdminAvatarTryOnPanel from './avatar-try-on/AdminAvatarTryOnPanel'
import AdminChallengeContentPanel from './AdminChallengeContentPanel'

type AdminMenuKey = 'avatarTryOn' | 'challenge'

export default function AdminPage() {
  const router = useRouter()
  const { disconnect } = useDisconnect()
  const [activeMenu, setActiveMenu] = useState<AdminMenuKey>('avatarTryOn')

  const handleLogout = async () => {
    removeCookie(COOKIE.ACCESSTOKEN)
    try {
      await disconnect({ namespace: 'eip155' })
    } catch {
      // disconnect가 실패해도 cookie 제거는 완료됐으니 로그아웃 진행
    }
    router.replace('/signin')
  }

  return (
    <main className='admin-bg h-full overflow-y-auto px-16 pb-48 pt-16 app:pt-64'>
      <section className='mx-auto flex min-h-full max-w-[1040px] flex-col gap-28'>
        <header className='glass-panel sticky top-16 z-30 flex flex-col gap-12 rounded-24 px-20 py-12 md:flex-row md:items-center md:justify-between md:rounded-full md:py-10'>
          <div className='flex items-start justify-between gap-12 md:items-center'>
            <h1 className='text-20 font-bold text-[#1d1d1f]'>OpenRun Admin</h1>
            <button
              type='button'
              className='pill-inactive h-32 flex-shrink-0 rounded-full px-12 text-12 font-bold active:scale-95 hover:bg-white/60 md:hidden'
              onClick={handleLogout}>
              로그아웃
            </button>
          </div>
          <div className='flex items-center gap-12'>
            <AdminMenu activeMenu={activeMenu} onSelect={setActiveMenu} />
            <button
              type='button'
              className='pill-inactive hidden h-36 flex-shrink-0 rounded-full px-14 text-12 font-bold active:scale-95 hover:bg-white/60 md:inline-flex md:items-center'
              onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </header>

        {activeMenu === 'avatarTryOn' ? <AdminAvatarTryOnPanel /> : <AdminChallengeContentPanel />}
      </section>
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
    { key: 'avatarTryOn', label: '아바타' },
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
              'h-36 flex-shrink-0 rounded-full px-14 text-13 font-bold active-press-duration active:scale-95',
              selected ? 'pill-active' : 'pill-inactive hover:bg-white/60',
            )}
            onClick={() => onSelect(item.key)}>
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
