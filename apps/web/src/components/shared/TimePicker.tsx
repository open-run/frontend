import { useState } from 'react'
import { padStart } from '@utils/string'
import { currentDate } from '@utils/time'
import { colors } from '@styles/colors'
import { useChainScroll } from '@hooks/useChainScroll'

// [00, 01, 02, ..., 23]
const hours = Array.from({ length: 24 }, (_, i) => padStart(i))
// [00, 05, 10, ..., 55]
const minutes5Term = Array.from({ length: 12 }, (_, i) => padStart(i * 5))

export default function TimePicker({
  value,
  onChange,
}: {
  value?: string
  onChange: (value: string /* hh:mm */) => void
}) {
  const [hour, setHour] = useState(value?.split(':')[0] ?? getNarrowTime().hour)
  const [minute, setMinute] = useState(value?.split(':')[1] ?? getNarrowTime().minute)

  return (
    <article className='relative flex items-center justify-center gap-24'>
      <Picker
        options={hours}
        initialValue={hour}
        onChange={(hour) => {
          setHour(hour)
          onChange(`${hour}:${minute}`)
        }}
      />
      <span className='font-bold text-black-darken'>:</span>
      <Picker
        options={minutes5Term}
        initialValue={minute}
        onChange={(minute) => {
          setMinute(minute)
          onChange(`${hour}:${minute}`)
        }}
      />

      <div className='bg-gray absolute top-40 h-1 w-133'></div>
      <div className='bg-gray absolute bottom-40 h-1 w-133'></div>
    </article>
  )
}

const getNarrowTime = () => {
  const now = currentDate()
  const hour = padStart(now.getHours())
  const minute = Math.floor(now.getMinutes() / 5 + 1) * 5

  return {
    hour,
    minute: minute === 60 ? '00' : padStart(minute),
  }
}

const ITEM_HEIGHT = 40
const VISIBLE_SLOTS = 3
const CENTER_Y = (ITEM_HEIGHT * VISIBLE_SLOTS - ITEM_HEIGHT) / 2

function Picker({
  options,
  initialValue,
  onChange,
}: {
  options: string[]
  initialValue: string
  onChange: (value: string) => void
}) {
  if (options.includes(initialValue) === false) {
    throw new Error('initialValue must be included in options')
  }

  const { centerIndex, subPixelOffset, containerRef, handlers } = useChainScroll({
    totalItems: options.length,
    itemHeight: ITEM_HEIGHT,
    wrap: true,
    initialIndex: options.indexOf(initialValue),
    onChange: (index) => onChange(options[index]),
  })

  return (
    <div
      ref={containerRef}
      className='relative w-30 cursor-move touch-none select-none overflow-hidden'
      style={{ height: ITEM_HEIGHT * VISIBLE_SLOTS }}
      {...handlers}
    >
      {Array.from({ length: VISIBLE_SLOTS }, (_, i) => i - 1).map((slot) => {
        const rawIndex = centerIndex + slot
        const itemIndex = ((rawIndex % options.length) + options.length) % options.length
        const yPos = slot * ITEM_HEIGHT - subPixelOffset + CENTER_Y
        const dist = Math.abs(slot - subPixelOffset / ITEM_HEIGHT)
        const isSelected = dist < 0.5

        return (
          <div
            key={slot}
            className='absolute flex w-full items-center justify-center text-14 font-bold'
            style={{
              transform: `translateY(${yPos}px)`,
              height: ITEM_HEIGHT,
              color: isSelected ? colors.black.darken : colors.gray.DEFAULT,
            }}
          >
            {options[itemIndex]}
          </div>
        )
      })}
    </div>
  )
}
