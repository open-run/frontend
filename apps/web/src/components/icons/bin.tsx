import { IconProps } from '@type/icon'

export function BinIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 24 24' fill={color}>
      <path d='M14.5714 3V3.9H18V5.7H6V3.9H9.42857V3H14.5714Z' />
      <path d='M9.42857 17.4H11.1429V10.2H9.42857V17.4Z' />
      <path d='M14.5714 17.4H12.8571V10.2H14.5714V17.4Z' />
      <path fillRule='evenodd' clipRule='evenodd' d='M6 21V6.6H18V21H6ZM16.2857 19.2H7.71429V8.4H16.2857V19.2Z' />
    </svg>
  )
}
