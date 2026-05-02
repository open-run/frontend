'use client'

import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { InfoIcon } from '@icons/info'

export default function GeneralItem({
  progressNode,
  title,
  description,
  rewardStatusNode,
}: {
  progressNode: ReactNode
  title: string
  description: string
  rewardStatusNode: ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.article
      className='flex flex-col rounded-8 bg-white px-16 py-10'
      layout
      transition={{
        layout: {
          duration: 0.25,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      }}>
      <section className='grid w-full grid-cols-[60px_1fr_70px] place-items-center gap-8'>
        {progressNode}
        <p className='flex w-full items-center justify-between gap-8 justify-self-start text-left text-14 font-bold'>
          {title}
          {description && (
            <button
              className='flex-shrink-0 active-press-duration active:scale-90'
              onClick={() => setIsOpen((prev) => !prev)}>
              <InfoIcon />
            </button>
          )}
        </p>
        {rewardStatusNode}
      </section>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          marginTop: isOpen ? 10 : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.25,
          ease: [0.25, 0.46, 0.45, 0.94],
          height: {
            duration: 0.25,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
          opacity: {
            duration: 0.2,
            ease: 'easeInOut',
          },
        }}
        className='overflow-hidden'>
        <section className='rounded-8 bg-gray-lighten px-16 py-8'>
          <p className='text-12'>{description}</p>
        </section>
      </motion.div>
    </motion.article>
  )
}
