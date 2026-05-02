import clsx from 'clsx'
import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'

const NumberInput = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'inputMode'> & {
    error?: string
    addon?: ReactNode
    setValue?: (value: string) => void
  }
>(({ className, setValue, onChange, addon, error, value, ...rest }, ref) => {
  return (
    <div className='relative w-full'>
      <input
        ref={ref}
        className={clsx(
          'disabled:bg-gray h-40 w-full rounded-8 px-16 text-14 focus:outline-none disabled:text-gray-darken',
          error ? 'border-2 border-pink caret-pink' : 'border-gray border caret-primary focus:border-primary',
          className,
        )}
        type='number'
        inputMode='numeric'
        pattern='[0-9]*'
        value={value}
        onChange={(event) => {
          const inputValue = event.target.value
          if (/^[0-9]*$/.test(inputValue)) {
            setValue?.(inputValue)
            onChange?.(event)
          }
        }}
        {...rest}
      />
      {addon}
      <span className='ml-8 text-12 font-bold text-pink'>{error}</span>
      <style jsx>{`
        /* 숫자 입력 필드의 화살표 제거 */
        input[type='number']::-webkit-outer-spin-button,
        input[type='number']::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type='number'] {
          -moz-appearance: textfield; /* Firefox에서 화살표 제거 */
        }
      `}</style>
    </div>
  )
})

NumberInput.displayName = 'NumberInput'

export default NumberInput
