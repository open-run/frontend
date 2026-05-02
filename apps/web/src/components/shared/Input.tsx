import clsx from 'clsx'
import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & {
    error?: string
    addon?: ReactNode
    setValue?: (value: string) => void
  }
>(({ className, setValue, onChange, addon, error, ...rest }, ref) => {
  return (
    <div className='relative w-full'>
      <input
        ref={ref}
        className={clsx(
          'disabled:bg-gray h-40 w-full rounded-8 px-16 text-14 focus:outline-none disabled:text-gray-darken',
          error ? 'border-2 border-pink caret-pink' : 'border-gray border caret-primary focus:border-primary',
          className,
        )}
        onChange={(event) => {
          setValue?.(event.target.value)
          onChange?.(event)
        }}
        {...rest}
      />
      {addon}
      <span className='ml-8 text-12 font-bold text-pink'>{error}</span>
    </div>
  )
})

Input.displayName = 'Input'

export default Input
