import { IconProps } from '@type/icon'

export function CalendarIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 16 16' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14.6666 14.6663V5.99967L14.6666 4.66634L1.33331 4.66634V5.99967V14.6663H14.6666ZM1.33331 2.66634L14.6666 2.66634L14.6666 1.33301H12.6666H3.33331H1.33331V2.66634ZM5.33331 8.66634H3.99998V7.33301H5.33331V8.66634ZM6.66665 8.66634H7.99998V7.33301H6.66665V8.66634ZM5.33331 11.333H3.99998V9.99967H5.33331V11.333ZM10.6666 11.9997H12V10.6663H10.6666V11.9997Z'
        fill={color}
      />
    </svg>
  )
}
