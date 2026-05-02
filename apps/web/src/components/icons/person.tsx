import { IconProps } from '@type/icon'

export function OutlinedPersonIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 24 24'>
      <rect fill={color} x='1' y='-1' width='4' height='5' rx='2' transform='matrix(1 0 0 -1 9 8)' strokeWidth='2' />
      <path
        fill={color}
        fillRule='evenodd'
        clipRule='evenodd'
        d='M4 20C4 19.6613 4.02104 19.3276 4.06189 19H6.08296H7H17.917C17.441 16.1623 14.973 14 12 14C9.77915 14 7.84012 15.2066 6.80269 17H4.58152C5.76829 14.0682 8.64262 12 12 12C16.0796 12 19.446 15.0537 19.9381 19C19.979 19.3276 20 19.6613 20 20V21H18H6H4V20Z'
      />
    </svg>
  )
}

export function FilledPersonIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 16 16' fill='none'>
      <rect
        x='1'
        y='-1'
        width='2'
        height='2.66667'
        rx='1'
        transform='matrix(1 0 0 -1 6 4.66699)'
        fill={color}
        stroke={color}
        strokeWidth='2'
      />
      <path
        d='M7.99996 9C5.71888 9 3.84946 10.7625 3.67926 13H12.3207C12.1505 10.7625 10.281 9 7.99996 9Z'
        fill={color}
        stroke={color}
        strokeWidth='2'
      />
    </svg>
  )
}
