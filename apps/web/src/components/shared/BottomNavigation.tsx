'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { ExploreIcon } from '@icons/explore'
import { OutlinedFlagIcon } from '@icons/flag'
import { OpenrunIcon } from '@icons/openrun'
import { OutlinedPersonIcon } from '@icons/person'
import { RoundedPlusIcon } from '@icons/plus'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'
import { VIBRATION_TYPE } from '@constants/app'
import { useVibration } from '@hooks/useVibration'
import CreateBung from '../home/create-bung/CreateBung'

export default function BottomNavigation() {
  const pathname = usePathname()
  const { showModal } = useModal()
  const vibrate = useVibration()
  return (
    <footer
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-[999] flex justify-center bg-gradient-bottom-navigation px-16 pt-16 pb-24 app:pb-40',
      )}>
      <div className='flex h-56 w-full max-w-[328px] items-center justify-between rounded-28 bg-white px-[9px]'>
        <IconLink
          href='/'
          icon={<OpenrunIcon size={24} color={pathname === '/' ? colors.black.darken : colors.gray.DEFAULT} />}
          label='홈'
        />
        <IconLink
          href='/explore'
          icon={<ExploreIcon size={24} color={pathname === '/explore' ? colors.black.darken : colors.gray.DEFAULT} />}
          label='탐색'
        />
        <button
          className='group flex h-full flex-1 items-center justify-center'
          onClick={() => {
            vibrate(VIBRATION_TYPE.IMPACT_MEDIUM)
            showModal({ key: MODAL_KEY.CREATE_BUNG, component: <CreateBung /> })
          }}>
          <RoundedPlusIcon size={36} />
        </button>
        <IconLink
          href='/challenges?list=progress&category=general'
          icon={
            <OutlinedFlagIcon
              size={24}
              color={pathname.includes('/challenges') ? colors.black.darken : colors.gray.DEFAULT}
            />
          }
          label='도전과제'
        />
        <IconLink
          href='/profile'
          icon={
            <OutlinedPersonIcon size={24} color={pathname === '/profile' ? colors.black.darken : colors.gray.DEFAULT} />
          }
          label='프로필'
        />
      </div>
    </footer>
  )
}

function IconLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  const pathname = usePathname()
  const vibrate = useVibration()
  const isActive = pathname === href || (href.includes('challenges') && pathname.includes('challenges'))
  
  const handleClick = () => {
    vibrate(VIBRATION_TYPE.SELECTION)
  }
  
  return (
    <Link className='flex h-full flex-1 items-center justify-center' href={href} onClick={handleClick}>
      <div className='flex flex-col items-center justify-center rounded-8 px-8 py-4 active-press-duration active:scale-90 active:bg-gray/50'>
        {icon}
        <span className={clsx('text-10 font-medium', isActive ? 'text-black-darken' : 'text-gray')}>{label}</span>
      </div>
    </Link>
  )
}
