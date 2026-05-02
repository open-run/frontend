'use client'

import { useLayoutEffect } from 'react'
import { useChainScroll } from '@hooks/useChainScroll'

export interface ChainPickerProps {
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  wrap?: boolean
  renderItem?: (value: number, isSelected: boolean) => React.ReactNode
  className?: string
}

const ITEM_HEIGHT = 64
const CONTAINER_HEIGHT = 320
const CENTER_Y = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

export default function ChainPicker({
  value,
  min,
  max,
  onChange,
  wrap = true,
  renderItem,
  className,
}: ChainPickerProps) {
  const totalItems = max - min + 1

  const { scrollY, centerIndex, subPixelOffset, containerRef, handlers, syncToIndex } =
    useChainScroll({
      totalItems,
      itemHeight: ITEM_HEIGHT,
      wrap,
      initialIndex: value - min,
      onChange: (index) => onChange(min + index),
    })

  useLayoutEffect(() => {
    syncToIndex(value - min)
  }, [value, min, syncToIndex])

  return (
    <div
      ref={containerRef}
      className={`relative h-[320px] cursor-grab touch-none select-none overflow-hidden ${className ?? ''}`}
      {...handlers}
    >
      {Array.from({ length: 7 }, (_, i) => i - 3).map((slot) => {
        const rawIndex = centerIndex + slot
        const itemIndex = wrap ? mod(rawIndex, totalItems) : rawIndex

        if (!wrap && (itemIndex < 0 || itemIndex >= totalItems)) return null

        const itemValue = min + itemIndex
        const yPos = slot * ITEM_HEIGHT - subPixelOffset + CENTER_Y
        const dist = Math.abs(slot - subPixelOffset / ITEM_HEIGHT)
        const opacity = Math.min(1, Math.pow(0.2, dist))
        const isSelected = dist < 0.5

        return (
          <div
            key={slot}
            className='absolute flex w-full items-center justify-center font-black italic tracking-tight'
            style={{
              transform: `translateY(${yPos}px)`,
              height: `${ITEM_HEIGHT}px`,
              fontSize: '56px',
              color: `rgba(74, 92, 239, ${opacity})`,
              userSelect: 'none',
            }}
          >
            {renderItem ? renderItem(itemValue, isSelected) : String(itemValue).padStart(2, '0')}
          </div>
        )
      })}
    </div>
  )
}
