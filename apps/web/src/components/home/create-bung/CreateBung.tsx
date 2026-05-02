'use client'

import { useRef, useState } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { BottomSheet, BottomSheetRef, Dimmed } from '@shared/Modal'
import { BrokenXIcon } from '@icons/x'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'
import Forms from './Forms'
import Invitation from './Invitation'

export type CreateBungInitialDraft = {
  name?: string
  title?: string
  description?: string
  location?: string
  detailedAddress?: string
  runningTime?: number | string
  distance?: number | string
  paceMinute?: number | string
  paceSecond?: number | string
  memberNumber?: number | string
  hasAfterRun?: boolean
  afterRunDescription?: string
  hashtags?: string[]
}

export default function CreateBung({
  initialStep = 'create',
  initialDraft,
}: {
  initialStep?: 'create' | 'invitation'
  initialDraft?: CreateBungInitialDraft
}) {
  const { closeModal } = useModal()
  const sheetRef = useRef<BottomSheetRef>(null)
  const handleClose = () => sheetRef.current?.close()

  const [step, setStep] = useState<'create' | 'invitation'>(initialStep)

  return (
    <Dimmed onClick={handleClose}>
      <BottomSheet ref={sheetRef} onClose={() => closeModal(MODAL_KEY.CREATE_BUNG)} fullSize>
        <header className='relative flex h-60 w-full items-center justify-center px-16'>
          <span className='text-16 font-bold'>{step === 'create' ? '벙 만들기' : '멤버 초대'}</span>
          <button
            className='absolute right-12 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'
            onClick={handleClose}>
            {step === 'create' ? (
              <BrokenXIcon size={24} color={colors.black.DEFAULT} />
            ) : (
              <span className='text-14 text-black-darken'>건너뛰기</span>
            )}
          </button>
        </header>

        <section className='h-[calc(100%-110px)] overflow-y-auto'>
          {step === 'create' ? <Forms nextStep={() => setStep('invitation')} initialDraft={initialDraft} /> : <Invitation />}
        </section>
      </BottomSheet>
    </Dimmed>
  )
}
