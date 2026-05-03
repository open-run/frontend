import { IconProps } from '@type/icon'

export function CheckIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 16 16' fill='none'>
      <rect x='5.88574' y='10.876' width='8' height='1.33333' transform='rotate(-45 5.88574 10.876)' fill={color} />
      <rect
        x='4.27637'
        y='7.38184'
        width='4.66667'
        height='1.33333'
        transform='rotate(45 4.27637 7.38184)'
        fill={color}
      />
    </svg>
  )
}
