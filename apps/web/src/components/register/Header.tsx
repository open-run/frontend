import { RegisterStep } from '@type/register'
import { ArrowLeftIcon } from '@icons/arrow'
import { colors } from '@styles/colors'

export default function Header({
  step,
  onBackIconClick,
  onSkipTextClick,
}: {
  step: RegisterStep
  onBackIconClick: () => void
  onSkipTextClick: () => void
}) {
  const 건너뛰기버튼이보이는단계인가 = step === 2 || step === 3

  return (
    <header className='absolute flex h-60 w-full items-center bg-gray-lighten px-16 app:top-50'>
      <div className='flex w-full items-center justify-between'>
        <button className='group' onClick={onBackIconClick}>
          <ArrowLeftIcon
            className='rounded-8 active-press-duration group-active:scale-90 group-active:bg-gray/50'
            size={40}
            color={colors.black.darkest}
          />
        </button>
        {건너뛰기버튼이보이는단계인가 ? (
          <button
            className='rounded-8 px-8 py-4 active-press-duration active:scale-95 active:bg-gray/50'
            onClick={onSkipTextClick}>
            <span className='text-14'>건너뛰기</span>
          </button>
        ) : null}
      </div>

      <section className='absolute bottom-0 left-16 right-16 h-3'>
        <div
          className='h-full w-full bg-primary'
          style={{
            transform: `scaleX(${step / 4})`,
            transformOrigin: 'left',
            transition: 'transform 0.3s',
          }}
        />
      </section>
    </header>
  )
}
