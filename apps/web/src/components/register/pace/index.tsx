import TypingText from '@components/shared/TypingText'
import FaceNumberPicker from './FaceNumberPicker'

export default function Pace({ pace, setPace }: { pace: string; setPace: (pace: string) => void }) {
  return (
    <div className='flex h-full w-full flex-col items-center pt-124 app:pt-174'>
      <div className='mt-10 text-center text-28'>평균 페이스를 알려주세요</div>
      <TypingText
        text='나의 평균 페이스는'
        wrapper='div'
        className='mb-50 text-center text-28 font-bold text-primary'
      />
      <FaceNumberPicker
        defaultValue={pace}
        onChange={setPace}
        minMinutes={0}
        maxMinutes={20}
        minSeconds={0}
        maxSeconds={59}
      />
    </div>
  )
}
