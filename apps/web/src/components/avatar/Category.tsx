import { AnimatePresence, motion } from 'framer-motion'
import { ElementType } from 'react'
import { MainCategory, SelectedCategory, SubCategory } from '@type/avatar'
import {
  AccessoriesIcon,
  FaceIcon,
  FootwearIcon,
  FullSetIcon,
  HairIcon,
  LowerClothingIcon,
  SkinIcon,
  UpperClothingIcon,
} from '@icons/avatar'

const categoryList: {
  mainCategory: MainCategory
  icon: ElementType
}[] = [
  { mainCategory: 'upperClothing', icon: UpperClothingIcon },
  { mainCategory: 'lowerClothing', icon: LowerClothingIcon },
  { mainCategory: 'fullSet', icon: FullSetIcon },
  { mainCategory: 'footwear', icon: FootwearIcon },
  { mainCategory: 'face', icon: FaceIcon },
  { mainCategory: 'skin', icon: SkinIcon },
  { mainCategory: 'hair', icon: HairIcon },
  {
    mainCategory: 'accessories',
    icon: AccessoriesIcon,
  },
]

const subCategoryList: {
  subCategory: SubCategory
  label: string
}[] = [
  { subCategory: 'head-accessories', label: '머리 장식' },
  { subCategory: 'eye-accessories', label: '눈 장식' },
  { subCategory: 'ear-accessories', label: '귀 장식' },
  { subCategory: 'body-accessories', label: '몸 장식' },
]

export default function Category({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: SelectedCategory
  setSelectedCategory: (category: SelectedCategory) => void
}) {
  return (
    <section className='flex w-full flex-col gap-16 pt-16'>
      <div className='flex w-full items-center gap-6 overflow-x-auto px-16'>
        {categoryList.map((item) => (
          <button
            key={item.mainCategory}
            className={`flex h-40 w-40 flex-shrink-0 items-center justify-center rounded-4 ${
              selectedCategory.mainCategory === item.mainCategory ? 'bg-gray' : ''
            }`}
            onClick={() => setSelectedCategory({ mainCategory: item.mainCategory, subCategory: null })}>
            <item.icon focused={selectedCategory.mainCategory === item.mainCategory} />
          </button>
        ))}
      </div>
      <AnimatePresence>
        {selectedCategory.mainCategory === 'accessories' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='overflow-hidden'>
            <div className='flex items-center gap-4 overflow-x-auto px-16'>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 rounded-4 px-8 py-2 text-14 ${
                  selectedCategory.subCategory === null ? 'bg-gray font-bold' : ''
                }`}
                onClick={() => setSelectedCategory({ ...selectedCategory, subCategory: null })}>
                전체
              </motion.button>
              <div className='ml-4 mr-4 h-16 w-1 border-l border-gray' />
              {subCategoryList.map((subItem) => (
                <motion.button
                  key={subItem.subCategory}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 rounded-4 px-8 py-2 text-14 ${
                    selectedCategory.subCategory === subItem.subCategory ? 'bg-gray font-bold' : ''
                  }`}
                  onClick={() => setSelectedCategory({ ...selectedCategory, subCategory: subItem.subCategory })}>
                  {subItem.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
