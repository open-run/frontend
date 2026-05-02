'use client'

import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { RegisterStep, UserRegister } from '@type/register'
import { ArrowLeftIcon } from '@icons/arrow'
import { useRegister } from '@apis/v1/users/mutation'
import { colors } from '@styles/colors'
import BottomButton from './BottomButton'
import Header from './Header'
import Frequency from './frequency'
import Nickname from './nickname'
import { NicknameValidState } from './nickname/types'
import Onboarding from './onboarding'
import Pace from './pace'
import Welcome from './welcome'

export default function Register() {
  const route = useRouter()
  const { mutate: register } = useRegister()

  const [data, setData] = useState<UserRegister>({
    nickname: '',
    runningPace: `00\'00\"`,
    runningFrequency: 0,
  })
  const [step, setStep] = useState<RegisterStep>(0)

  const handlePrevious = () => {
    if (step === 0) {
      route.replace('/signin')
      return
    }

    setStep((prev) => (prev - 1) as RegisterStep)
  }
  const handleNext = () => {
    if (step === 1 && (isValid === 'overlap' || isValid === 'consonant')) {
      alert('다른 닉네임을 입력해주세요.')
      return
    }

    setStep((prev) => (prev + 1) as RegisterStep)
  }

  /* STEP 1 : Nickname */
  const [isValid, setIsValid] = useState<NicknameValidState>('default')
  const 닉네임스텝에서버튼이비활성화상태인가 = step === 1 && isValid !== 'pass'

  const handleSubmit = () => {
    register(data, {
      onSuccess: () => {
        route.replace('/')
      },
    })
  }

  return (
    <section
      className={clsx(
        'relative flex h-full w-full max-w-tablet flex-col items-center',
        step === 0 ? 'bg-gradient-primary-white' : 'bg-gray-lighten',
      )}>
      {step === 0 ? (
        <button
          className='group absolute left-0 top-0 z-[10] ml-16 h-60 app:top-50'
          onClick={handlePrevious}>
          <ArrowLeftIcon
            className='rounded-8 active-press-duration group-active:scale-90 group-active:bg-primary-darken/20'
            size={40}
            color={colors.white}
          />
        </button>
      ) : null}
      {step === 0 ? <Welcome /> : null}

      {step > 0 ? <Header step={step} onBackIconClick={handlePrevious} onSkipTextClick={() => setStep(4)} /> : null}
      {step === 1 ? (
        <Nickname
          nickname={data.nickname}
          setNickname={(value) => {
            setData((prev) => ({ ...prev, nickname: value }))
          }}
          isValid={isValid}
          setIsValid={setIsValid}
        />
      ) : null}

      {step === 2 ? (
        <Pace pace={data.runningPace ?? ''} setPace={(value) => setData((prev) => ({ ...prev, runningPace: value }))} />
      ) : null}

      {step === 3 ? (
        <Frequency
          frequency={data.runningFrequency}
          setFrequency={(value) => setData((prev) => ({ ...prev, runningFrequency: value }))}
        />
      ) : null}

      {step === 4 ? <Onboarding nickname={data.nickname} /> : null}

      <section className='absolute left-1/2 w-full max-w-tablet -translate-x-1/2 px-16 bottom-40 app:bottom-56'>
        <BottomButton onClick={step === 4 ? handleSubmit : handleNext} disabled={닉네임스텝에서버튼이비활성화상태인가}>
          {step === 0 ? '시작하기' : null}
          {step === 1 || step === 2 || step === 3 ? '다음' : null}
          {step === 4 ? '홈으로' : null}
        </BottomButton>
      </section>
    </section>
  )
}
