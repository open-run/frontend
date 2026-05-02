import { IconProps } from '@type/icon'

export function MailIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 16 16'>
      <path
        fill={color}
        d='M14.6663 12.667H5.33325V11.334H13.3333V5.86719L7.99927 9.33398L2.66626 5.86719V8.66699H1.33325V3.33398H14.6663V12.667ZM8.00024 7.74316L12.7327 4.66699H3.26587L8.00024 7.74316Z'
      />
    </svg>
  )
}
