import TypingText from '@components/shared/TypingText'
import { WeekCount } from '@type/register'
import ChainPicker from '@shared/ChainPicker'

export default function Frequency({
  frequency = 0,
  setFrequency,
}: {
  frequency?: WeekCount
  setFrequency: (frequency: WeekCount) => void
}) {
  return (
    <section className='flex flex-col items-center pt-124 app:pt-174'>
      <p className='text-center text-28'>얼마나 자주 뛰시나요?</p>
      <TypingText
        text='나의 일주일 러닝 횟수는'
        wrapper='p'
        className='mb-40 text-center text-28 font-bold text-primary'
      />

      <div className='flex items-center justify-center'>
        <ChainPicker
          value={frequency}
          min={0}
          max={7}
          onChange={(val) => setFrequency(val as WeekCount)}
          wrap={true}
          renderItem={(val) => (val === 7 ? '7 +' : String(val))}
          className='w-86'
        />
      </div>
    </section>
  )
}
