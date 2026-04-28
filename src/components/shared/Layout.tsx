'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import MarketingLayout from './MarketingLayout'

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    // iframe 내부에서는 항상 모바일(앱) 뷰를 표시
    // → MarketingLayout의 iframe이 같은 URL을 로드할 때 마케팅 화면이 중첩되는 것을 방지
    const isInIframe = window.self !== window.top

    const checkScreenSize = () => {
      setIsDesktop(!isInIframe && window.innerWidth >= 576)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  if (pathname.startsWith('/admin')) {
    return <main className='h-dvh w-dvw overflow-hidden'>{children}</main>
  }

  // 576px 이상 & iframe이 아닌 경우: 마케팅 화면
  if (isDesktop) {
    return (
      <main className='h-dvh w-dvw'>
        <MarketingLayout />
      </main>
    )
  }

  // 576px 이하 또는 iframe 내부: 원래 Layout
  return (
    <main className='h-dvh w-dvw'>
      <section className='mx-auto h-full w-full max-w-tablet overflow-hidden'>{children}</section>
    </main>
  )
}
