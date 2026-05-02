import { ReactNode } from 'react'

export default function BottomButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      className='active:scale-98 h-59 w-full rounded-8 bg-primary text-16 font-bold text-white active-press-duration active:bg-primary-darken disabled:bg-gray'
      disabled={disabled}
      onClick={onClick}>
      {children}
    </button>
  )
}
