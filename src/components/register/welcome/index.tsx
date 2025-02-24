import Image from 'next/image'
import Spacing from '@components/shared/Spacing'

export default function Welcome() {
  return (
    <section className='relative flex h-full w-full flex-col items-center bg-gradient-primary-white'>
      <Image
        className='absolute z-0 object-cover'
        src='/images/bg_signin.png'
        priority
        fill
        sizes='(max-width: 768px) 100vw, 33vw'
        alt='배경 이미지'
      />
      <div className='h-[20dvh]'></div>
      <div className='z-10 flex flex-col items-center text-center'>
        <p className='text-4xl text-white'>당신만의 캐릭터</p>
        <p className='text-4xl font-bold text-white'>함께 달리는 즐거움!</p>
        <Spacing size={32} />
        <p className='text-4xl font-bold text-secondary'>{`오픈런 가입을\n환영합니다!`}</p>
      </div>
    </section>
  )
}
