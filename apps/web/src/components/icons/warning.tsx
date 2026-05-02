import { IconProps } from '@type/icon'

export function WarningIcon({ size, className }: Omit<IconProps, 'color'>) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <path
        d='M10.6934 3.14915C11.268 2.13518 12.7289 2.13518 13.3035 3.14915L22.7294 19.7831C23.296 20.7831 22.5737 22.0226 21.4243 22.0226H2.57251C1.42317 22.0226 0.700839 20.7831 1.26748 19.7831L10.6934 3.14915Z'
        fill='#EBE9EF'
      />
      <rect x='11.0117' y='8.75195' width='2.25882' height='6.77647' rx='1.12941' fill='#D7D6DE' />
      <rect x='11.0117' y='16.9395' width='2.25882' height='2.25882' rx='1.12941' fill='#D7D6DE' />
    </svg>
  )
}
