'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from '@icons/arrow'
import useAppInsetSize from '@hooks/useAppInsetSize'
import { colors } from '@styles/colors'

export default function ProfileSubpageShell({ title, children }: { title: string; children: ReactNode }) {
  const topPadding = useAppInsetSize('top', 0)
  const bottomPadding = useAppInsetSize('bottom', 24)

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
      <section className='scrollbar-web-hidden min-h-0 flex-1 overflow-y-auto'>{children}</section>
    </section>
  )
}
