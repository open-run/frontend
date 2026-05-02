import Spacing from '@shared/Spacing'
import { CalendarIcon } from '@icons/calendar'
import { PlaceIcon } from '@icons/place'
import { formatDate } from '@utils/time'
import { DEFAULT_PROFILE_IMAGE_URL } from '@constants/profile'
import { colors } from '@styles/colors'
import Avatar from './Avatar'

export default function RecommendationCard({
  backgroundImageUrl,
  title,
  location,
  time,
  remainingCount,
  hashtags,
  participantImageUrls,
}: {
  backgroundImageUrl: string
  title: string
  location: string
  time: string
  remainingCount: number
  hashtags: string[]
  participantImageUrls: Array<string | null | undefined>
}) {
  // 남은 시간을 상태로 관리
  const formattedDate = formatDate({ date: time, formatStr: 'M월 d일 (E) a h:mm', convertUTCtoLocale: true })
  const participantList = participantImageUrls.slice(0, 5).map((imageUrl) => imageUrl || DEFAULT_PROFILE_IMAGE_URL)

  return (
    <article
      className='active:scale-98 relative mx-auto h-200 w-full max-w-[500px] rounded-8 bg-cover bg-center p-16 text-white shadow-lg active-press-duration'
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
      <span className='text-16 font-bold'>{title}</span>
      <Spacing size={8} />
      <div className='flex gap-6'>
        <PlaceIcon className='translate-y-2' size={16} color={colors.white} />
        <span className='text-14'>{location}</span>
      </div>
      <Spacing size={2} />
      <div className='flex items-center gap-6'>
        <CalendarIcon size={16} color={colors.white} />
        <span className='text-14'>{formattedDate}</span>
      </div>
      <Spacing size={12} />
      <div className='flex items-center'>
        {participantList.map((src, index) => (
          <Avatar key={`${src}-${index}`} className={index !== 0 ? '-ml-12' : ''} imageSrc={src} size={35} />
        ))}
        <Spacing direction='horizontal' size={8} />
        <span>{remainingCount} 자리 남음</span>
      </div>
      <div className='absolute bottom-16 left-16 flex gap-4'>
        {hashtags.map((value) => (
          <div key={`tag-${value}`} className='rounded-4 bg-black-darken/60 px-6 text-white'>
            <span className='text-12'>{value}</span>
          </div>
        ))}
      </div>
    </article>
  )
}
