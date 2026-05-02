import { IconProps } from '@type/icon'

export function BellIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 27 27' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M13 4H11V6V6.06189C7.05369 6.55399 4 9.92039 4 14V21H3V23H9C9 24.6569 10.3431 26 12 26C13.6569 26 15 24.6569 15 23H21V21H20V14C20 9.92038 16.9463 6.55399 13 6.06189V6V4Z'
        fill={color}
      />
    </svg>
  )
}
