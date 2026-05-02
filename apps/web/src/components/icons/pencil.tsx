import { IconProps } from '@type/icon'

export function PencilIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14.3333 5.66667L18.3333 9.66667L7 21H3V17L14.3333 5.66667ZM15.6667 9.66667L14.3333 8.33333L4.88562 17.781V19.1144H6.21895L15.6667 9.66667Z'
        fill={color}
      />
      <path d='M19.6667 8.33333L15.6667 4.33333L17 3L21 7L19.6667 8.33333Z' fill={color} />
    </svg>
  )
}
