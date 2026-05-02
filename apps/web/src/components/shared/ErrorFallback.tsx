'use client'

import Link from 'next/link'
import { WarningIcon } from '@icons/warning'

export default function ErrorFallback({ type }: { type: 'small' | 'medium' | 'large' }) {
  if (type === 'small') {
    return (
      <div className='flex size-full items-center gap-4'>
        <p className='text-18 font-semibold text-[#D7D6DE]'>정보를 불러오지 못했어요</p>
        <WarningIcon className='-translate-y-2' size={24} />
      </div>
    )
  }

  if (type === 'medium') {
    return (
      <div className='flex size-full flex-col items-center justify-center gap-10'>
        <WarningIcon size={50} />
        <p className='text-18 font-bold text-[#D7D6DE]'>정보를 불러오지 못했어요</p>
      </div>
    )
  }

  if (type === 'large') {
    return (
      <div className='flex size-full flex-col items-center justify-center'>
        <WarningIcon className='mb-10' size={60} />
        <p className='mb-25 text-22 font-bold text-[#D7D6DE]'>정보를 불러오지 못했어요</p>
        <Link href='/signin' className='rounded-20 border border-[#D7D6DE] px-28 py-6 text-16 font-semibold'>
          재시도
        </Link>
      </div>
    )
  }

  return null
}
