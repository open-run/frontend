'use client'

import { useEffect, useState } from 'react'

type Wrapper = 'p' | 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type Props = {
  text: string
  className?: string
  wrapper?: Wrapper
  charDelay?: number
  cursor?: boolean
}

export default function TypingText({
  text,
  className,
  wrapper = 'p',
  charDelay = 80,
  cursor = true,
}: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    let rafId = 0
    let startTime = 0

    const tick = (now: number) => {
      if (cancelled) return
      if (startTime === 0) startTime = now
      const elapsed = now - startTime
      const next = Math.min(text.length, Math.floor(elapsed / charDelay))
      setIndex(next)
      if (next < text.length) {
        rafId = requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(() => {
      if (cancelled) return
      requestAnimationFrame(() => {
        if (cancelled) return
        rafId = requestAnimationFrame(tick)
      })
    })

    return () => {
      cancelled = true
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [text, charDelay])

  const Tag = wrapper
  const displayed = text.slice(0, index)
  const showCursor = cursor && index < text.length

  return (
    <Tag className={`${className ?? ''} grid`}>
      <span aria-hidden className='invisible col-start-1 row-start-1'>
        {text}
      </span>
      <span className='col-start-1 row-start-1'>
        {displayed}
        {showCursor && (
          <span aria-hidden className='inline-block animate-pulse'>
            |
          </span>
        )}
      </span>
    </Tag>
  )
}
