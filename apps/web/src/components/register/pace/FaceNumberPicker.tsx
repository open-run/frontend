import { useState } from 'react'
import { padStart } from '@utils/string'
import ChainPicker from '@shared/ChainPicker'

interface FaceNumberPickerProps {
  defaultValue: string
  onChange: (value: string) => void
  minMinutes?: number
  maxMinutes?: number
  minSeconds?: number
  maxSeconds?: number
}

export default function FaceNumberPicker({
  defaultValue,
  onChange,
  minMinutes = 0,
  maxMinutes = 59,
  minSeconds = 0,
  maxSeconds = 59,
}: FaceNumberPickerProps) {
  const [minutes, setMinutes] = useState(parseInt(defaultValue.split("'")[0]))
  const [seconds, setSeconds] = useState(parseInt(defaultValue.split("'")[1]))

  const handleMinutesChange = (newMinutes: number) => {
    setMinutes(newMinutes)
    onChange(`${padStart(newMinutes)}\'${padStart(seconds)}\"`)
  }

  const handleSecondsChange = (newSeconds: number) => {
    setSeconds(newSeconds)
    onChange(`${padStart(minutes)}\'${padStart(newSeconds)}\"`)
  }

  return (
    <div className='flex items-center justify-center'>
      <ChainPicker
        value={minutes}
        min={minMinutes}
        max={maxMinutes}
        onChange={handleMinutesChange}
        wrap={true}
        className='w-86'
      />
      <div className='-ml-2 mb-18 mr-4 touch-none text-center font-pretendard text-40 font-bold italic tracking-tight text-primary'>
        {`'`}
      </div>
      <ChainPicker
        value={seconds}
        min={minSeconds}
        max={maxSeconds}
        onChange={handleSecondsChange}
        wrap={true}
        className='w-86'
      />
      <div className='-ml-4 mb-18 touch-none text-center font-pretendard text-40 font-bold italic tracking-tight text-primary'>
        {`"`}
      </div>
    </div>
  )
}
