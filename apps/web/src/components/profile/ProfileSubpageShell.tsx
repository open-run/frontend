'use client'

import { useRef, type ReactNode } from 'react'
import Link from 'next/link'
import OverlayScrollbar from '@shared/OverlayScrollbar'
import { ArrowLeftIcon } from '@icons/arrow'
import useAppInsetSize from '@hooks/useAppInsetSize'
import { colors } from '@styles/colors'

export default function ProfileSubpageShell({ title, children }: { title: string; children: ReactNode }) {
  const topPadding = useAppInsetSize('top', 0)
  const bottomPadding = useAppInsetSize('bottom', 24)
  const contentScrollRef = useRef<HTMLElement>(null)

  return (
    <section
      className='flex h-full w-full flex-col bg-gray-lighten'
      style={{ paddingTop: topPadding, paddingBottom: bottomPadding }}>
      <header className='relative mb-24 flex h-60 w-full shrink-0 items-center justify-center'>
        <Link href='/profile' className='absolute left-16'>
          <button className='-translate-x-4 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'>
            <ArrowLeftIcon size={24} color={colors.black.darken} />
          </button>
        </Link>
        <span className='text-16 font-bold text-black'>{title}</span>
      </header>
      <div className='relative min-h-0 flex-1'>
        <section ref={contentScrollRef} className='scrollbar-web-hidden h-full overflow-y-auto'>
          {children}
        </section>
        <OverlayScrollbar scrollRef={contentScrollRef} />
      </div>
    </section>
  )
}
