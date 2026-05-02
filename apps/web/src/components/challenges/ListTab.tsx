'use client'

import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { ListType } from '@type/challenge'
import { OutlinedFlagIcon } from '@icons/flag'
import { colors } from '@styles/colors'

export default function ListTab() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedTab = (searchParams.get('list') as ListType) || ''

  const handleToggle = () => {
    const newTab = selectedTab === 'progress' ? 'completed' : 'progress'
    const newCategory = newTab === 'progress' ? 'general' : ''

    const params = new URLSearchParams(searchParams.toString())
    params.set('list', newTab)
    if (newCategory) {
      params.set('category', newCategory)
    } else {
      params.delete('category')
    }

    router.push(`?${params.toString()}`)
  }

  return (
    <button className='relative inline-flex h-34 items-center rounded-full shadow-floating-primary'>
      {/* 배경 애니메이션 */}
      <motion.div
        className='absolute top-2 h-30 rounded-full bg-black'
        initial={false}
        animate={{
          x: selectedTab === 'progress' ? 0 : 76,
          width: selectedTab === 'progress' ? 76 : 43,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      />

      <div className='relative rounded-full transition-colors' onClick={handleToggle}>
        <div
          className={clsx(
            'flex items-center gap-2 px-10 py-5',
            selectedTab === 'progress' ? 'text-white' : 'text-gray-darken',
          )}>
          <OutlinedFlagIcon size={16} color={selectedTab === 'progress' ? colors.white : colors.gray.darken} />
          <span className='text-14 font-bold'>진행 중</span>
        </div>
      </div>

      <div className='relative rounded-full transition-colors' onClick={handleToggle}>
        <div
          className={clsx(
            'flex items-center gap-8 px-10 py-5',
            selectedTab === 'completed' ? 'text-white' : 'text-gray-darken',
          )}>
          <span className='text-14 font-bold'>완료</span>
        </div>
      </div>
    </button>
  )
}
