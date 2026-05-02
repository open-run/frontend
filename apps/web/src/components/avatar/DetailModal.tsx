'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useModal } from '@contexts/ModalProvider'
import { Rarity } from '@type/avatar'
import PrimaryButton from '@shared/PrimaryButton'
import { BrokenXIcon } from '@icons/x'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'
import { Dimmed } from '../shared/Modal'
import RarityBadge from './shared/RarityBadge'

export default function DetailModal({
  serialNumber,
  imageSrc,
  rarity,
  category,
  name,
}: {
  serialNumber: string
  imageSrc: string
  rarity: Rarity
  category: string
  name: string
}) {
  const { closeModal } = useModal()

  return (
    <Dimmed onClick={() => closeModal(MODAL_KEY.AVATAR_DETAIL)}>
      <section className='flex h-full w-full items-center justify-center px-16'>
        <div
          className='relative flex h-480 w-full max-w-[328px] flex-col items-center rounded-8 bg-white bg-gradient-white-secondary-primary'
          onClick={(e) => e.stopPropagation()}>
          <header className='relative mb-16 flex h-60 w-full items-center justify-center'>
            <span className='text-16 font-bold'>NFT 아이템</span>
            <button
              className='absolute right-18 translate-x-4 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'
              onClick={() => closeModal(MODAL_KEY.AVATAR_DETAIL)}>
              <BrokenXIcon size={24} color={colors.black.DEFAULT} />
            </button>
          </header>

          <div className='relative mb-8 aspect-square w-168'>
            <span className='absolute bottom-0 left-1/2 -translate-x-1/2 font-jost text-56 font-[900] italic text-black opacity-10'>
              {serialNumber}
            </span>
            <Image src={imageSrc} alt='Avatar' fill className='object-contain' />
          </div>

          <RarityBadge rarity={rarity} className='mb-8' />
          <h4 className='mb-4 text-16 font-bold text-black-darken'>{name}</h4>
          <span className='text-12 text-gray-darkest'>{category}</span>

          <Link href='' className='absolute bottom-40 w-[calc(100%-32px)]'>
            <PrimaryButton>스캐너 페이지로 이동</PrimaryButton>
          </Link>
        </div>
      </section>
    </Dimmed>
  )
}
