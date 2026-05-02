import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode, useRef } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { useAppStore } from '@store/app'
import { BottomSheet, BottomSheetRef, Dimmed } from '@shared/Modal'
import { ArrowRightIcon } from '@icons/arrow'
import { MailIcon } from '@icons/mail'
import { BrokenXIcon } from '@icons/x'
import useLogout from '@hooks/useLogout'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'
import DeleteUserModal from './DeleteUserModal'

export default function SettingModal() {
  const router = useRouter()
  const { closeModal, showModal } = useModal()
  const sheetRef = useRef<BottomSheetRef>(null)
  const handleClose = () => sheetRef.current?.close()
  const { logout } = useLogout()
  const { isApp } = useAppStore()

  return (
    <Dimmed onClick={handleClose}>
      <BottomSheet ref={sheetRef} onClose={() => closeModal(MODAL_KEY.SETTING)}>
        <header className='mb-16 flex h-60 w-full items-center justify-center'>
          <button
            className='absolute right-16 translate-x-4 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'
            onClick={handleClose}>
            <BrokenXIcon size={24} color={colors.black.DEFAULT} />
          </button>
          <span className='text-16 font-bold text-black-darken'>설정</span>
        </header>

        <section className={clsx('px-16 pb-16 app:pb-40')}>
          <MenuButton
            label='회원 정보 수정'
            rightNode={<ArrowRightIcon size={16} color={colors.black.darken} />}
            onClick={() => {
              router.push('/profile/modify-user')
              closeModal(MODAL_KEY.SETTING)
            }}
          />
          {isApp && (
            <MenuButton
              label='알림 설정'
              rightNode={<ArrowRightIcon size={16} color={colors.black.darken} />}
              onClick={() => {
                router.push('/profile/set-notification')
                closeModal(MODAL_KEY.SETTING)
              }}
            />
          )}
          <MenuButton
            label='개발팀 문의하기'
            rightNode={
              <Link
                href='mailto:devteam@openrun.com'
                className='flex items-center gap-4 rounded-10 border border-gray bg-gray-lighten px-8 py-2 text-12'>
                <span className='text-12'>devteam@openrun.com</span>
                <MailIcon size={16} color={colors.black.darken} />
              </Link>
            }
          />
          <hr className='my-16 border-gray' />
          <MenuButton
            label='로그아웃'
            onClick={() => {
              closeModal(MODAL_KEY.SETTING)
              logout()
            }}
          />
          <MenuButton
            className='text-pink'
            label='계정 탈퇴'
            onClick={() =>
              showModal({
                key: MODAL_KEY.DELETE_USER,
                component: <DeleteUserModal />,
              })
            }
          />
        </section>
      </BottomSheet>
    </Dimmed>
  )
}

function MenuButton({
  label,
  rightNode,
  className,
  onClick,
}: {
  label: string
  rightNode?: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <button
      className={clsx('group w-full rounded-8 px-8 py-24 active-press-duration active:bg-gray/30', className)}
      onClick={onClick}>
      <div className='group-active:scale-98 flex items-center justify-between gap-8 active-press-duration'>
        <span className='text-14 font-bold'>{label}</span>
        {rightNode}
      </div>
    </button>
  )
}
