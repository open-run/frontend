import { IconProps } from '@type/icon'

export function CopyClipboardIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 16 16' fill='none'>
      <path fill={color} d='M12.667 2.33301H6V2.33398H4.66699V1H14V12.333H12.667V2.33301ZM2 15V3.66699H11.333V15H2Z' />
    </svg>
  )
}
