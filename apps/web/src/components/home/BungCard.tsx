'use client'

import clsx from 'clsx'
import Spacing from '@shared/Spacing'
import { CalendarIcon } from '@icons/calendar'
import { BoxedCrownIcon } from '@icons/crown'
import { PlaceIcon } from '@icons/place'
import { RunnerIcon } from '@icons/runner'
import useTimer from '@hooks/useTimer'
import { formatDate, timerFormat } from '@utils/time'
import { colors } from '@styles/colors'

export default function BungCard({
  backgroundImageUrl,
  time,
  title,
  place,
  distance,
  pace,
  isBungOwner,
}: {
  backgroundImageUrl: string
  time: string
  title: string
  place: string
  distance: number
  pace: string
  isBungOwner: boolean
}) {
  const { days, hours, minutes, seconds } = useTimer(time)
  const formattedTime = timerFormat({ days, hours, minutes, seconds })
  const formattedDate = formatDate({ date: time, formatStr: 'M월 d일 (E) a h:mm', convertUTCtoLocale: true })
  const 벙이시작되었는가 = days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0

  return (
    <article
      className={clsx(
        'active:scale-98 relative mx-auto h-184 w-full max-w-[500px] rounded-8 bg-cover bg-center p-16 text-white shadow-lg active-press-duration',
        벙이시작되었는가 && 'border-3 border-secondary',
      )}
      style={{
        backgroundImage: `${벙이시작되었는가 ? 'linear-gradient(90deg, rgba(0, 0, 0, 0.00) 0%, rgba(224, 251, 96, 0.50) 100%), ' : ''}url(${backgroundImageUrl})`,
      }}>
      {isBungOwner ? <BoxedCrownIcon className='absolute right-16 top-16' size={24} color={colors.white} /> : null}
      <span
        className={clsx(
          'mb-8 inline-flex text-16 font-black italic',
          벙이시작되었는가 && 'animate-pulse font-jost font-black text-secondary',
        )}>
        {벙이시작되었는가 ? 'Run Started!' : formattedTime}
      </span>
      <p className='mb-8 truncate text-16 font-bold text-white'>{title}</p>
      <div className='mb-2 flex gap-6'>
        <PlaceIcon className='flex-shrink-0 translate-y-2' size={16} color={colors.white} />
        <span className='text-14'>{place}</span>
      </div>
      <div className='mb-2 flex items-center gap-6'>
        <CalendarIcon size={16} color={colors.white} />
        <span className='text-14'>{formattedDate}</span>
      </div>
      <div className='flex items-center gap-6'>
        <RunnerIcon size={16} color={colors.white} />
        <span className='font-jost text-14'>
          {distance}km {pace}
        </span>
      </div>
    </article>
  )
}
