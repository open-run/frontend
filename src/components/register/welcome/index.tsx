import Image from 'next/image'
import Spacing from '@components/shared/Spacing'
import TypingText from '@components/shared/TypingText'

export default function Welcome() {
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
      <div className='h-[20dvh]'></div>
      <div className='z-10 flex flex-col items-center text-center'>
        <p className='text-28 text-white'>당신만의 캐릭터</p>
        <p className='text-28 font-bold text-white'>함께 달리는 즐거움!</p>
        <Spacing size={32} />
        <TypingText
          text={'오픈런 가입을\n환영합니다!'}
          wrapper='p'
          className='whitespace-pre-line text-28 font-bold text-secondary'
        />
      </div>
    </section>
  )
}
