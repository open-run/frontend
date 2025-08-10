'use client'

import { useForm } from 'react-hook-form'
import { useUserStore } from '@store/user'
import Input from '@shared/Input'
import NumberInput from '@shared/NumberInput'

type FormValues = {
  nickname: string
  paceMinute: number
  paceSecond: number
  frequency: number
}

export default function Form() {
  const { userInfo } = useUserStore()
  const { paceMinute, paceSecond } = parseRunningPace(userInfo.runningPace)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      nickname: userInfo.nickname,
      paceMinute,
      paceSecond,
      frequency: userInfo.runningFrequency,
    },
  })

  return (
    <section className='px-16'>
      <div className='mb-16 flex flex-col gap-8'>
        <span className='text-14 font-bold'>닉네임</span>
        <Input
          placeholder='2~10자 이내로 입력해 주세요'
          error={errors.nickname?.message}
          addon={
            <span className='absolute right-20 top-20 -translate-y-1/2 text-14 text-gray-darken'>
              {watch('nickname').length}/10
            </span>
          }
          {...register('nickname', {
            required: '필수 항목입니다',
            maxLength: {
              value: 10,
              message: '10자 이하로 입력해 주세요',
            },
          })}
        />
      </div>

      <div className='mb-16 flex flex-col gap-8'>
        <span className='text-14 font-bold'>페이스</span>
        <div className='flex gap-8'>
          <NumberInput
            placeholder='분'
            addon={<span className='absolute right-16 top-10 text-14 font-bold italic text-black'>{"'"}</span>}
            error={errors.paceMinute?.message}
            {...register('paceMinute', {
              required: '필수 항목입니다',
            })}
          />
          <NumberInput
            placeholder='초'
            addon={<span className='absolute right-16 top-10 text-14 font-bold italic text-black'>{'"'}</span>}
            error={errors.paceSecond?.message}
            {...register('paceSecond', {
              required: '필수 항목입니다',
            })}
          />
        </div>
      </div>

      <div className='relative mb-40 flex flex-col gap-8'>
        <span className='text-14 font-bold'>일주일 러닝 횟수</span>
        <NumberInput
          className='pr-40'
          placeholder='예상되는 소요 시간을 알려주세요'
          addon={<span className='absolute right-16 top-10 text-14'>회</span>}
          error={errors.frequency?.message}
          {...register('frequency', {
            required: '필수 항목입니다',
          })}
        />
      </div>

      <button className='h-56 w-full rounded-8 bg-primary text-16 font-bold text-white'>업데이트</button>
    </section>
  )
}

const parseRunningPace = (runningPace: string) => {
  const trimmed = runningPace.trim()
  const match = trimmed.match(/^(\d{1,2})'\s*(\d{1,2})(?:"?)$/)
  if (match) {
    return { paceMinute: Number(match[1]), paceSecond: Number(match[2]) }
  }
  return { paceMinute: 0, paceSecond: 0 }
}
