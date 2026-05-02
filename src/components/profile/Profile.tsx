'use client'

import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import 'swiper/css'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useModal } from '@contexts/ModalProvider'
import AddressClipboard from '@shared/AddressClipboard'
import { CopyClipboardIcon } from '@icons/clipboard'
import { CrownIcon } from '@icons/crown'
import { FilledFlagIcon } from '@icons/flag'
import { SettingIcon } from '@icons/setting'
import { StarIcon } from '@icons/star'
import { FilledThumbIcon, OutlinedThumbIcon } from '@icons/thumb'
import { UpperClothIcon } from '@icons/upper-cloth'
import { useUserInfo } from '@apis/v1/users/query'
import { MODAL_KEY } from '@constants/modal'
import { DEFAULT_PROFILE_IMAGE_URL } from '@constants/profile'
import { colors } from '@styles/colors'
import SettingModal from './SettingModal'

export default function Profile() {
  const { data } = useUserInfo()
  const { showModal } = useModal()

  return (
    <section className='h-full w-full bg-gray-lighten'>
      <div className='h-full px-24 pt-32 app:pt-72'>
        <header className='mb-12 flex items-center justify-between'>
          <h1 className='text-28 font-bold'>프로필</h1>
          <div className='flex items-center gap-8'>
            <Link href='/avatar'>
              <AvatarButton />
            </Link>
            <SettingButton
              onClick={() =>
                showModal({
                  key: MODAL_KEY.SETTING,
                  component: <SettingModal />,
                })
              }
            />
          </div>
        </header>

        <div className='mx-auto mb-8 size-[88px] shrink-0 rounded-8 border border-gray bg-white'>
          <Image
            className='size-full object-contain'
            src={data?.data.profileImageUrl || DEFAULT_PROFILE_IMAGE_URL}
            alt='avatar'
            width={88}
            height={88}
          />
        </div>
        <h4 className='mb-4 text-center text-16 font-bold'>{data?.data.nickname}</h4>
        <AddressClipboard>
          {(address) => (
            <div className='mx-auto mb-8 flex w-fit cursor-pointer items-center gap-8 rounded-16 bg-white px-16 py-4 active-press-duration active:scale-95 active:bg-gray/30'>
              <span className='font-jost text-14 tracking-[0.035em]'>{address}</span>
              <CopyClipboardIcon size={16} color={colors.black.DEFAULT} />
            </div>
          )}
        </AddressClipboard>

        <div className='mb-24 flex items-center gap-8 py-10'>
          <Record
            className='flex-1'
            icon={<FilledThumbIcon size={16} color={colors.black.DEFAULT} />}
            value={300}
            title='받은 좋아요'
          />
          <Record
            className='flex-1'
            icon={<CrownIcon size={16} color={colors.black.DEFAULT} />}
            value={78}
            title='개설한 벙'
          />
          <Record
            className='flex-1'
            icon={<FilledFlagIcon size={16} color={colors.black.DEFAULT} />}
            value={120}
            title='획득한 NFT'
          />
        </div>

        <div className='mb-24 h-76 w-full rounded-8 bg-black-darken'>
          <Swiper
            className='h-full'
            modules={[Autoplay]}
            slidesPerView={1}
            centeredSlides
            loop
            direction='vertical'
            autoplay={{ delay: 3000 }}>
            <SwiperSlide>
              <RecentNftCard
                image='/temp/nft_profile_parts.png'
                title='이벤트 NFT 장착하고 성당 근처에서 달리기'
                description='도전과제 달성으로 획득'
                date='2024.12.25'
              />
            </SwiperSlide>
            <SwiperSlide>
              <RecentNftCard
                image='/temp/nft_profile_parts.png'
                title='비 오는 날 10km 달리기'
                description='특별 도전과제 달성으로 획득'
                date='2024.12.20'
              />
            </SwiperSlide>
            <SwiperSlide>
              <RecentNftCard
                image='/temp/nft_profile_parts.png'
                title='새벽 5시 러닝 클럽 참여'
                description='연속 참여 보상으로 획득'
                date='2024.12.15'
              />
            </SwiperSlide>
          </Swiper>
        </div>

        <div className='flex h-[calc(100%-495px)] w-full flex-col gap-8 overflow-y-auto scrollbar-hide'>
          <CompletedBung title='완료한 일정' location='서울 마포구 공덕동' date='6/11 (화) 오후 7:00' />
          <CompletedBung title='완료한 일정' location='서울 마포구 공덕동' date='6/11 (화) 오후 7:00' />
        </div>
      </div>
    </section>
  )
}

function AvatarButton() {
  return (
    <button className='flex h-40 w-40 items-center justify-center rounded-full bg-black-darken/10 active-press-duration active:scale-90 active:bg-black-darken/20'>
      <UpperClothIcon size={16} color={colors.white} />
    </button>
  )
}

function SettingButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className='flex h-40 w-40 items-center justify-center rounded-full bg-black-darken/10 active-press-duration active:scale-90 active:bg-black-darken/20'
      onClick={onClick}>
      <SettingIcon size={16} color={colors.white} />
    </button>
  )
}

function Record({
  icon,
  value,
  title,
  className,
}: {
  icon: React.ReactNode
  value: number
  title: string
  className?: string
}) {
  return (
    <div className={clsx('flex flex-col items-center', className)}>
      {icon}
      <span className='font-jost text-16 font-black'>{value}</span>
      <span className='text-10 font-medium text-gray-darken'>{title}</span>
    </div>
  )
}

function RecentNftCard({
  image,
  title,
  description,
  date,
  className,
}: {
  image: string
  title: string
  description: string
  date: string
  className?: string
}) {
  return (
    <div className={clsx('relative flex h-full w-full gap-8 rounded-8 p-8', className)}>
      <div className='size-60 flex-shrink-0 place-content-center place-items-center rounded-8 bg-gray-lighten'>
        <Image src={image} alt='parts' width={52} height={52} />
      </div>
      <div className='flex flex-col'>
        <span className='flex items-center gap-4 text-12 font-bold text-secondary'>
          최근 획득한 NFT
          <StarIcon size={16} color={colors.secondary} />
        </span>
        <p className='text-12 text-white'>
          <strong>{title}</strong> {description}
        </p>
      </div>
      <span className='absolute bottom-8 right-8 text-10 text-gray-darker'>{date}</span>
    </div>
  )
}

function CompletedBung({ title, location, date }: { title: string; location: string; date: string }) {
  return (
    <div className='flex w-full items-center justify-between rounded-8 bg-white p-16'>
      <div className='flex gap-16'>
        <div className='flex size-40 items-center justify-center rounded-8 bg-gray-lighten'>
          <OutlinedThumbIcon size={16} color={colors.black.darken} />
        </div>

        <div className='flex flex-col'>
          <span className='text-12 font-bold'>{title}</span>
          <span className='text-10 font-medium'>{location}</span>
          <span className='text-10 font-medium'>{date}</span>
        </div>
      </div>

      <button className='rounded-8 bg-black-darken px-11 py-10 text-14 font-bold text-white active-press-duration active:scale-95 active:bg-black-darken/80'>
        피드백 남기기
      </button>
    </div>
  )
}
