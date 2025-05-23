import Image from 'next/image'
import Spacing from '@shared/Spacing'

export default function Onboarding({ nickname }: { nickname: string }) {
  return (
    <section className='flex flex-col items-center'>
      <Spacing size={30 + 64} />
      <p className='text-center text-28'>
        <strong>{nickname}</strong> 님
      </p>
      <p className='text-center text-28 font-bold text-primary'>{`지금부터 러닝의\n새로운 재미를 발견해요!`}</p>
      <Spacing size={40} />
      <Image src='/images/img_onboarding.png' alt='Onboarding' width={328} height={328} />
    </section>
  )
}
