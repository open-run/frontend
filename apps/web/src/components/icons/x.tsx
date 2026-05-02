import { IconProps } from '@type/icon'

export function BrokenXIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M18.364 7.05024L13.4142 12L18.364 16.9497L16.9497 18.3639L12 13.4142L7.05025 18.3639L5.63604 16.9497L7.05025 15.5355L10.5858 12L12 10.5858L14.8284 7.75735L16.9497 5.63603L18.364 7.05024ZM9.87868 8.46445L7.05025 5.63603L5.63604 7.05024L8.46447 9.87867L9.87868 8.46445Z'
        fill={color}
      />
    </svg>
  )
}
