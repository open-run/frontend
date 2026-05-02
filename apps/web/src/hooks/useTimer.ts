import { differenceInSeconds } from 'date-fns'
import { useEffect, useState } from 'react'
import { convertUTCtoLocaleDate, currentDate } from '@utils/time'

export default function useTimer(targetTime: number | string | Date) {
  const localTargetTime = convertUTCtoLocaleDate(targetTime)

  // 남은 시간을 상태로 관리
  const [remainingTime, setRemainingTime] = useState(differenceInSeconds(localTargetTime, currentDate()))

  useEffect(() => {
    // 타이머를 1초마다 업데이트
    const timerId = setInterval(() => {
      const secondsLeft = differenceInSeconds(localTargetTime, currentDate())
      if (secondsLeft <= 0) {
        clearInterval(timerId)
      }
      setRemainingTime(secondsLeft)
    }, 1000)

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(timerId)
  }, [localTargetTime])

  // 남은 시간을 일, 시, 분, 초로 변환
  const days = Math.floor(remainingTime / (3600 * 24))
  const hours = Math.floor((remainingTime % (3600 * 24)) / 3600)
  const minutes = Math.floor((remainingTime % 3600) / 60)
  const seconds = remainingTime % 60

  return { days, hours, minutes, seconds }
}
