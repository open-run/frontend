'use client'

import Image, { StaticImageData } from 'next/image'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import './swiper-custom.css'

export type Slide = {
  title: string
  staticImage: StaticImageData
}

const mockData = [
  {
    imageUrl: '/temp/nft_home_challenge.png',
    title: '[2024 크리스마스] 루돌프 선물배달 작전',
    description: '이벤트 NFT 장착하고 성당 근처에서 달리기',
    progress: 40,
    endDate: '2024-12-25',
  },
  {
    imageUrl: '/temp/nft_home_challenge.png',
    title: '[2024 크리스마스] 루돌프 선물배달 작전',
    description: '이벤트 NFT 장착하고 성당 근처에서 달리기',
    progress: 40,
    endDate: '2024-12-25',
  },
  {
    imageUrl: '/temp/nft_home_challenge.png',
    title: '[2024 크리스마스] 루돌프 선물배달 작전',
    description: '이벤트 NFT 장착하고 성당 근처에서 달리기',
    progress: 40,
    endDate: '2024-12-25',
  },
  {
    imageUrl: '/temp/nft_home_challenge.png',
    title: '[2024 크리스마스] 루돌프 선물배달 작전',
    description: '이벤트 NFT 장착하고 성당 근처에서 달리기',
    progress: 40,
    endDate: '2024-12-25',
  },
]

export default function ChallengeSwiper() {
  return (
    <Swiper
      spaceBetween={20}
      modules={[Autoplay, Pagination]}
      slidesPerView={1.15}
      centeredSlides
      loop
      autoplay={{ delay: 4_000, disableOnInteraction: true }}
      pagination={{
        clickable: true,
      }}
      className='!pb-30 !pt-16'>
      {mockData.map((item, index) => (
        <SwiperSlide key={`swiper-slide-${index}`}>
          <div
            role='button'
            className='active:scale-98 flex h-[92px] w-full cursor-pointer items-center gap-8 rounded-8 bg-white p-16 shadow-floating-primary active-press-duration active:bg-gray/30'>
            <div className='flex aspect-square w-[60px] items-center justify-center rounded-8 bg-gray-lighten'>
              <Image src='/temp/nft_home_challenge.png' alt='' width={52} height={52} />
            </div>
            <div className='flex flex-1 flex-col'>
              <p className='text-14 font-bold'>{item.title}</p>
              <p className='mb-9 text-12'>{item.description}</p>
              <div className='mb-2 h-[2px] w-full rounded-8 bg-gray'>
                <div className='h-full rounded-8 bg-black-darken' style={{ width: `${item.progress}%` }} />
              </div>
              <span className='text-10'>{item.endDate}</span>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
