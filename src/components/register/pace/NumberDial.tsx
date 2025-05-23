import React from 'react'

interface NumberDialProps {
  value: number
  min: number
  max: number
  handleTouchStart: (e: React.TouchEvent) => void
  handleTouchMove: (e: React.TouchEvent) => void
  handleTouchEnd: () => void
  handleMouseDown: (e: React.MouseEvent) => void
  handleMouseMove: (e: React.MouseEvent) => void
  handleMouseUp: () => void
  handleWheel: (e: React.WheelEvent) => void
  digits: number // 표시할 자릿수
}

export default function NumberDial({
  value,
  min,
  max,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleWheel,
  /** 표시할 자릿수 */
  digits = 1,
}: NumberDialProps) {
  const getDisplayNumbers = (current: number, min: number, max: number) => {
    const numbers = []
    for (let i = -2; i <= 2; i++) {
      let num = current + i
      if (num < min) {
        num = max - (min - num - 1)
      } else if (num > max) {
        num = min + (num - max - 1)
      }
      numbers.push(num)
    }
    return numbers
  }

  const displayNumbers = getDisplayNumbers(value, min, max)

  /* [25.03] 1 ~ 7에서 0 ~ 7+로 표기 확장 */
  const renderItem = (num: number) => {
    if (digits === 1 && num === 7) {
      return '7 +'
    }

    return String(num).padStart(digits, '0')
  }

  return (
    <div
      className='relative h-full w-86 touch-none select-none overflow-hidden'
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}>
      {displayNumbers.map((num, index) => {
        const distance = Math.abs(index - 2)
        return (
          <div
            key={index}
            className={`absolute flex w-80 items-center justify-center text-28 font-black italic tracking-tight transition-all duration-200 ${
              distance === 0
                ? 'text-primary'
                : distance === 1
                  ? 'text-[rgba(74,92,239,0.18)]'
                  : 'text-[rgba(74,92,239,0.04)]'
            }`}
            style={{ transform: `translateY(${(index - 2) * 64 + 128}px)`, fontSize: '56px', userSelect: 'none' }}>
            {renderItem(num)}
          </div>
        )
      })}
    </div>
  )
}
