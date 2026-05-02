import { IconProps } from '@type/icon'

export function ChangeOwnerIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M4 4.98062L4.18825 5.15136L5.72667 6.54667L6.65549 4.68901L7.38197 3.23607L8.5 1L9.61803 3.23607L10.3445 4.68901L11.2733 6.54667L12.8117 5.15136L13 4.98062L15 3.16667V5.86675V12V14H13.9444H13H4H3.05556H2V12H4H13V7.6807L12.617 8.0281L10.6637 9.79963L9.48448 7.44109L8.5 5.47214L7.51552 7.44109L6.33625 9.79963L4.38304 8.0281L4 7.6807V10H2V5.86675V3.16667L4 4.98062Z'
        fill={color}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M17.1675 14L19.9956 16.8281H20L22 18.8281H9V16.8281H17.45L15.8947 15.2728L17.1675 14ZM22 19.8281H9V21.6281L22 21.6281V19.8281Z'
        fill={color}
      />
    </svg>
  )
}
