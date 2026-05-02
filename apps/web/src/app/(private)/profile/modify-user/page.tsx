import { Metadata } from 'next'
import Link from 'next/link'
import Form from '@components/profile/modify-user/Form'
import { ArrowLeftIcon } from '@icons/arrow'
import { colors } from '@styles/colors'

export default function Page() {
  return (
    <>
      <header className='relative mb-24 flex h-60 w-full items-center justify-center'>
        <Link href='/profile' className='absolute left-16'>
          <button className='-translate-x-4 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'>
            <ArrowLeftIcon size={24} color={colors.black.darken} />
          </button>
        </Link>
        <span className='text-16 font-bold text-black'>회원 정보 수정</span>
      </header>
      <Form />
    </>
  )
}

export const metadata: Metadata = {
  title: '회원 정보 수정',
}
