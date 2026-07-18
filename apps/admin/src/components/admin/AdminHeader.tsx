'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useDisconnect } from '@reown/appkit/react'
import { COOKIE } from '@openrun/api-client/constants'
import { removeCookie } from '@openrun/api-client/cookie'

const MENU_ITEMS = [
  { href: '/avatar', label: '아바타' },
  { href: '/challenges', label: '도전과제' },
]

export default function AdminHeader() {
  const router = useRouter()
  const { disconnect } = useDisconnect()

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
    <header className='glass-panel sticky top-16 z-30 flex flex-col gap-12 rounded-24 px-20 py-12 md:flex-row md:items-center md:justify-between md:rounded-full md:py-10'>
      <div className='flex items-start justify-between gap-12 md:items-center'>
        <h1 className='text-18 font-semibold tracking-[-0.02em] text-[#1d1d1f]'>OpenRun Admin</h1>
        <button
          type='button'
          className='h-32 flex-shrink-0 rounded-full px-12 text-12 font-medium text-[#6e6e73] transition-colors hover:bg-black/[0.04] hover:text-[#1d1d1f] active:scale-95 md:hidden'
          onClick={handleLogout}>
          로그아웃
        </button>
      </div>
      <div className='flex items-center gap-8'>
        <AdminMenu />
        <button
          type='button'
          className='hidden h-32 flex-shrink-0 rounded-full px-12 text-12 font-medium text-[#6e6e73] transition-colors hover:bg-black/[0.04] hover:text-[#1d1d1f] active:scale-95 md:inline-flex md:items-center'
          onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </header>
  )
}

function AdminMenu() {
  const pathname = usePathname()

  return (
    <nav className='flex gap-2 overflow-x-auto rounded-full bg-black/[0.05] p-3'>
      {MENU_ITEMS.map((item) => {
        const selected = pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={selected ? 'page' : undefined}
            className={clsx(
              'inline-flex h-30 flex-shrink-0 items-center rounded-full px-14 text-12 transition-colors duration-150',
              selected
                ? 'bg-white font-semibold text-[#1d1d1f] shadow-[0_1px_4px_rgba(0,0,0,0.12)]'
                : 'font-medium text-[#6e6e73] hover:text-[#1d1d1f]',
            )}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
