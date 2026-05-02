import clsx from 'clsx'
import { ReactNode } from 'react'

export default function PrimaryButton({
  type = 'button',
  className,
  children,
  disabled,
  onClick,
}: {
  type?: 'button' | 'submit'
  className?: string
  children: ReactNode
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type={type}
      className={clsx(
        'active:scale-98 flex h-56 w-full items-center justify-center rounded-8 bg-primary active-press-duration active:bg-primary-darken disabled:bg-gray disabled:text-gray-lighten',
        className,
      )}
      disabled={disabled}
      onClick={onClick}>
      <span className='text-16 font-bold text-white'>{children}</span>
    </button>
  )
}
