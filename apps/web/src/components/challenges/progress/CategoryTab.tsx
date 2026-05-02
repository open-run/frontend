'use client'

import clsx from 'clsx'
import { useRouter, useSearchParams } from 'next/navigation'
import { CategoryType } from '@type/challenge'

export default function CategoryTab() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = (searchParams.get('category') as CategoryType) || ''

  const categoryList: Array<{ category: CategoryType; label: string }> = [
    { category: 'general', label: '일반' },
    { category: 'repetitive', label: '반복' },
  ]

  const handleCategoryChange = (category: CategoryType) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', category)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className='w-full border-b border-gray pl-24'>
      {categoryList.map((category) => (
        <button
          key={category.category}
          className={clsx(
            'px-16 pb-8 text-14 font-bold',
            category.category === selectedCategory && 'border-b-2 border-primary text-primary',
          )}
          onClick={() => handleCategoryChange(category.category)}>
          {category.label}
        </button>
      ))}
    </div>
  )
}
