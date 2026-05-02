import { IconProps } from '@type/icon'

export function UpperClothIcon({ size, color, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox='0 0 16 16'>
      <path
        fill={color}
        d='M15.4998 7.25L12.7732 9.125V14.001H3.22729V9.125L0.499756 7.25L3.90894 2H5.74976C5.74976 2.59664 5.98712 3.16888 6.40894 3.59082C6.83084 4.01272 7.4031 4.24993 7.99976 4.25C8.59649 4.25 9.16861 4.01277 9.59058 3.59082C10.0125 3.16885 10.2498 2.59675 10.2498 2H12.0906L15.4998 7.25Z'
      />
    </svg>
  )
}
