import { Metadata } from 'next'
import Image from 'next/image'
import SignIn from '@components/signin/Signin'
import Logo from '@shared/Logo'
import Spacing from '@shared/Spacing'

export default function SignInPage() {
  return (
    <section className='relative flex h-full w-full flex-col items-center bg-gradient-primary-white'>
      <Image
        className='absolute z-0 object-cover'
        src='/images/bg_signin.png'
        priority
        unoptimized
        fill
        sizes='(max-width: 768px) 100vw, 33vw'
        alt='배경 이미지'
      />
      <div className='h-[20dvh]' />
      <div className='z-10 flex flex-col items-center text-center'>
        <p className='text-28 text-white'>당신만의 캐릭터</p>
        <p className='text-28 font-bold text-white'>함께 달리는 즐거움!</p>
        <Spacing size={32} />
        <Logo />
      </div>
      <SignIn />
    </section>
  )
}

export const metadata: Metadata = {
  title: '로그인',
}
