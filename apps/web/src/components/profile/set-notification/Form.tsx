'use client'

import { useState } from 'react'
import Toggle from '@shared/Toggle'

export default function Form() {
  const [isPushNotificationEnabled, setIsPushNotificationEnabled] = useState(true)

  const handleTogglePushNotification = (value: boolean) => {
    setIsPushNotificationEnabled(value)
  }

  return (
    <section className='px-16'>
      <div className='flex w-full items-center justify-between'>
        <div className='flex flex-col gap-4'>
          <span className='text-14 font-bold'>푸시 알림</span>
          <p className='text-12'>벙 초대, 참여확인 등 유용한 알림들을 받아보세요</p>
        </div>
        <Toggle isOn={isPushNotificationEnabled} onToggle={handleTogglePushNotification} />
      </div>
    </section>
  )
}
