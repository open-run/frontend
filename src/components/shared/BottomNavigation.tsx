'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { useAppStore } from '@store/app'
import { ExploreIcon } from '@icons/explore'
import { OutlinedFlagIcon } from '@icons/flag'
import { OpenrunIcon } from '@icons/openrun'
import { OutlinedPersonIcon } from '@icons/person'
import { RoundedPlusIcon } from '@icons/plus'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'
import CreateBung from '../home/create-bung/CreateBung'

export default function BottomNavigation() {
  const pathname = usePathname()
  const { isApp } = useAppStore()
  const { showModal } = useModal()
  return (
    <footer
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-[999] flex justify-center bg-gradient-bottom-navigation px-16 pt-16',
        isApp ? 'pb-40' : 'pb-24',
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
          className='flex h-full flex-1 items-center justify-center'
          onClick={() => {
            showModal({ key: MODAL_KEY.CREATE_BUNG, component: <CreateBung /> })
          }}>
          <RoundedPlusIcon size={36} />
        </button>
        <IconLink
          href='/achievements'
          icon={
            <OutlinedFlagIcon
              size={24}
              color={pathname === '/achievements' ? colors.black.darken : colors.gray.DEFAULT}
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
  const isActive = pathname === href
  return (
    <Link className='flex h-full flex-1 flex-col items-center justify-center' href={href}>
      {icon}
      <span className={clsx('text-10 font-medium', isActive ? 'text-black-darken' : 'text-gray')}>{label}</span>
    </Link>
  )
}
