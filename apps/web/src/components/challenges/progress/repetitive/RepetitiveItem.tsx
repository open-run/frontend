'use client'

import { ReactNode } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { MODAL_KEY } from '@constants/modal'
import RepetitiveChallengeDetail from './RepetitiveDetailModal'

export default function RepetitiveItem({ challengeId, children }: { challengeId: number; children: ReactNode }) {
  const { showModal } = useModal()

  const handleClick = () => {
    showModal({
      key: MODAL_KEY.REPETITIVE_CHALLENGE_DETAIL,
      component: <RepetitiveChallengeDetail challengeId={challengeId} />,
    })
  }

  return (
    <div
      className='group w-full cursor-pointer rounded-8 bg-white px-16 py-10 active-press-duration focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-gray/30'
      role='button'
      onClick={handleClick}>
      <div className='grid grid-cols-[60px_1fr_auto] place-items-center gap-8 active-press-duration group-active:scale-98'>
        {children}
      </div>
    </div>
  )
}
