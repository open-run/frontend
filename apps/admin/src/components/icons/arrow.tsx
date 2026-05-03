import { IconProps } from '@type/icon'

export function ArrowLeftIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 40 40' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M26.7171 9.11612C27.2053 9.60427 27.2053 10.3957 26.7171 10.8839L17.601 20L26.7171 29.1161C27.2053 29.6043 27.2053 30.3957 26.7171 30.8839C26.229 31.372 25.4375 31.372 24.9494 30.8839L14.9494 20.8839C14.4612 20.3957 14.4612 19.6043 14.9494 19.1161L24.9494 9.11612C25.4375 8.62796 26.229 8.62796 26.7171 9.11612Z'
        fill={color}
      />
    </svg>
  )
}

export function ArrowRightIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <path d='M12.6 12L8 7.4L9.4 6L15.4 12L9.4 18L8 16.6L12.6 12Z' fill={color} />
    </svg>
  )
}
