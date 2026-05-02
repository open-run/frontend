'use client'

import Link from 'next/link'
import { WarningIcon } from '@icons/warning'

export default function NotFound() {
  return (
    <section className='h-screen w-screen'>
      <div className='flex size-full flex-col items-center justify-center'>
        <WarningIcon className='mb-10' size={60} />
        <p className='mb-25 text-22 font-bold text-gray'>페이지를 찾을 수 없어요</p>
        <p className='mb-25 text-16 text-gray'>요청하신 페이지가 존재하지 않습니다</p>
        <Link
          href='/'
          className='rounded-20 border border-gray px-28 py-6 text-16 font-semibold transition-colors hover:bg-gray hover:text-black'>
          홈으로 돌아가기
        </Link>
      </div>
    </section>
  )
}
