import { IconProps } from '@type/icon'

export function ClockIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 16 16' fill='none'>
      <path
        d='M2.55556 8C2.55556 4.99312 4.99312 2.55556 8 2.55556C11.0069 2.55556 13.4444 4.99312 13.4444 8C13.4444 11.0069 11.0069 13.4444 8 13.4444C7.45947 13.4444 6.93733 13.3657 6.44444 13.219V14.8265C6.94473 14.9401 7.46536 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 8.53463 1.05994 9.05527 1.17346 9.55556H2.78102C2.63433 9.06267 2.55556 8.54053 2.55556 8Z'
        fill={color}
      />
      <path d='M8 8H11.1111V9.55556H6.44444L6.44444 4.88889H8V8Z' fill={color} />
    </svg>
  )
}
