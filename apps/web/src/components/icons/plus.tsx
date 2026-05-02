import { IconProps } from '@type/icon'

export function RoundedPlusIcon({ size }: IconProps) {
  return (
    <svg width={size} height={size} viewBox='0 0 36 36'>
      <rect
        className='fill-white active-press-duration group-active:fill-gray-lighten'
        width={size}
        height={size}
        rx='18'
      />
      <path
        className='fill-gray-darken'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M19 10V17H26V19H19V26H17V24L17 19V17L17 13L17 10H19ZM14 17H10V19H14V17Z'
      />
    </svg>
  )
}

export function PlusIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 16 16' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8.66669 2.66699V7.33366H13.3334V8.66699H8.66669V13.3337H7.33335L7.33335 12.0003L7.33335 8.66699L7.33335 7.33366V4.66699V2.66699H8.66669ZM5.33335 7.33366H2.66669V8.66699H5.33335V7.33366Z'
        fill={color}
      />
    </svg>
  )
}
