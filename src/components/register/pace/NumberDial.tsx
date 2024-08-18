import React from 'react'

interface NumberDialProps {
  value: number
  min: number
  max: number
  onChange: (value: number) => void
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
  onChange,
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

  return (
    <div
      className='relative w-86 h-full overflow-hidden touch-none select-none'
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
            className={`absolute w-80 flex items-center justify-center transition-all duration-200 text-4xl italic font-black leading-[56px] tracking-tight ${
              distance === 0
                ? 'text-[#4A5CEF]'
                : distance === 1
                  ? 'text-[rgba(74,92,239,0.18)]'
                  : 'text-[rgba(74,92,239,0.04)]'
            }`}
            style={{ transform: `translateY(${(index - 2) * 64 + 128}px)`, fontSize: '56px', userSelect: 'none' }}>
            {num.toString().padStart(digits, '0')}
          </div>
        )
      })}
    </div>
  )
}
