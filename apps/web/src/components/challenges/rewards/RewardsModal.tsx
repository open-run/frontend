'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useModal } from '@contexts/ModalProvider'
import { Rarity } from '@type/avatar'
import RarityBadge from '@components/avatar/shared/RarityBadge'
import { MODAL_KEY } from '@constants/modal'

type RewardsModalProps = {
  serialNumber: string
  imageSrc: string
  rarity: Rarity
  name: string
  category: string
}

export default function RewardsModal({ serialNumber, imageSrc, rarity, name, category }: RewardsModalProps) {
  const { closeModal } = useModal()
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  return (
    <section className='fixed inset-0 z-modal'>
      {/* 배경: 파란색 + 하단 흰색 그라데이션 */}
      <div className='absolute inset-0 bg-primary' />
      <div className='absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-b from-transparent to-white' />

      <motion.div
        className='relative flex h-full w-full flex-col items-center'
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}>
        {/* 타이틀 */}
        <motion.h1
          className='mt-[105px] text-28 font-bold text-white'
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}>
          신규 획득!
        </motion.h1>

        {/* NFT 이미지 영역 */}
        <motion.div
          className='relative mt-40 flex flex-col items-center'
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}>
          <div className='relative aspect-square w-168'>
            <span className='absolute bottom-0 left-1/2 -translate-x-1/2 font-jost text-56 font-[900] italic text-white opacity-10'>
              {serialNumber}
            </span>

            {/* 이미지 로딩 Placeholder */}
            <AnimatePresence>
              {!isImageLoaded && (
                <motion.div
                  className='absolute inset-0 rounded-8 bg-white/20 animate-pulse'
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>

            <Image
              src={imageSrc}
              alt={name}
              fill
              className={`object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>

          {/* 레어리티 뱃지 */}
          <RarityBadge rarity={rarity} className='mt-8' />

          {/* 아이템 이름 */}
          <h4 className='mt-8 text-center text-16 font-bold text-white'>{name}</h4>

          {/* 아이템 분류 */}
          <span className='mt-4 text-12 text-white'>{category}</span>
        </motion.div>

        {/* 하단 버튼 영역 */}
        <div className='absolute bottom-40 left-16 right-16 flex flex-col gap-12'>
          <button
            className='flex h-56 w-full items-center justify-center rounded-8 bg-white active-press-duration active:scale-98 active:bg-gray-lighten'
            onClick={() => closeModal(MODAL_KEY.REWARD)}>
            <span className='text-16 font-bold text-black-darken'>확인</span>
          </button>

          <Link href='/avatar' onClick={() => closeModal(MODAL_KEY.REWARD)}>
            <button className='flex h-56 w-full items-center justify-center rounded-8 bg-primary active-press-duration active:scale-98 active:bg-primary-darken'>
              <span className='text-16 font-bold text-white'>아바타 꾸미러 가기</span>
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
