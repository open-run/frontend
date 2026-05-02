import { IconProps } from '@type/icon'

export function PlaceIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 16 16' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8 15L3.75736 11.2426C1.41421 8.89949 1.41421 5.1005 3.75736 2.75736C6.1005 0.414214 9.89949 0.414214 12.2426 2.75736C14.5858 5.1005 14.5858 8.89949 12.2426 11.2426L8 15ZM8 9C6.89543 9 6 8.10457 6 7C6 5.89543 6.89543 5 8 5C9.10457 5 10 5.89543 10 7C10 8.10457 9.10457 9 8 9Z'
        fill={color}
      />
    </svg>
  )
}
