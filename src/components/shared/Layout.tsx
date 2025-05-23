'use client'

import clsx from 'clsx'
import { CSSProperties, ReactNode } from 'react'

export default function Layout({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <main className={clsx('h-dvh w-dvw', className)} style={{ ...style }}>
      <section className='mx-auto h-full w-full max-w-tablet overflow-hidden'>{children}</section>
    </main>
  )
}
