import clsx from 'clsx'
import { Rarity } from '@type/avatar'
import RarityIcon from './RarityIcon'

export default function RarityBadge({ rarity, className }: { rarity: Rarity; className?: string }) {
  return (
    <>
      {rarity === 'common' && (
        <div className={clsx('rounded-4 bg-white px-8 py-2 shadow-floating-primary', className)}>
          <span className='rarity-common pr-2 font-jost text-12 font-black uppercase italic'>common</span>
        </div>
      )}

      {rarity === 'rare' && (
        <div className={clsx('relative rounded-4 bg-white py-0 pl-10 pr-8 shadow-floating-primary', className)}>
          <RarityIcon className='absolute -left-14 -top-2' rarity='rare' size={28} />
          <span className='rarity-rare pr-2 font-jost text-12 font-black uppercase italic'>rare</span>
        </div>
      )}

      {rarity === 'epic' && (
        <div className={clsx('relative rounded-4 bg-white py-0 pl-10 pr-8 shadow-floating-primary', className)}>
          <RarityIcon className='absolute -left-14 -top-2' rarity='epic' size={28} />
          <span className='rarity-epic pr-2 font-jost text-12 font-black uppercase italic'>epic</span>
        </div>
      )}
    </>
  )
}
