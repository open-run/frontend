import Image from 'next/image'
import { Avatar } from '@openrun/types'
import { RarityIcon } from '@openrun/ui'
import { TransparentOpenrunIcon } from '@openrun/ui/icons/openrun'
import { colors } from '@openrun/ui/styles/colors'
import { hasThumbnailImage } from '../avatar-try-on/wearingAvatar'

const GRID_CLASSNAME = 'grid grid-cols-4 gap-8 md:grid-cols-6 xl:grid-cols-8'
const SKELETON_CARD_COUNT = 16

type Props = {
  ownedItems: Avatar[]
}

export default function OwnedNftGrid({ ownedItems }: Props) {
  return (
    <div className={GRID_CLASSNAME}>
      {ownedItems.map((item, index) => (
        <OwnedNftCard key={`${item.id}-${index}`} item={item} />
      ))}
    </div>
  )
}

function OwnedNftCard({ item }: { item: Avatar }) {
  const balance = Number(item.balance ?? '1')

  return (
    <div className='glass-inset flex flex-col gap-6 rounded-8 p-8'>
      <div className='relative aspect-square w-full rounded-8 bg-white/50'>
        {hasThumbnailImage(item) ? (
          <Image
            alt={item.name}
            src={item.thumbnailUrl ?? ''}
            loading='lazy'
            fill
            sizes='(max-width: 768px) 25vw, 120px'
            className='object-contain p-2'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center'>
            <TransparentOpenrunIcon size={40} color={colors.gray.darker} />
          </div>
        )}

        {balance > 1 && (
          <span className='absolute right-4 top-4 rounded-full bg-white/90 px-7 py-2 font-jost text-11 font-semibold text-[#1d1d1f]'>
            ×{balance}
          </span>
        )}
      </div>

      <div className='min-w-0'>
        <p className='flex min-w-0 items-center gap-4 text-13 font-semibold text-[#1d1d1f]'>
          {item.rarity !== 'common' && <RarityIcon className='h-auto flex-shrink-0' rarity={item.rarity} size={18} />}
          <span className='min-w-0 truncate'>{item.name}</span>
        </p>
        <p className='truncate font-jost text-11 text-[#6e6e73]'>#{formatTokenId(item.tokenId)}</p>
      </div>
    </div>
  )
}

export function OwnedNftGridSkeleton() {
  return (
    <div className={GRID_CLASSNAME}>
      {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
        <div key={index} className='glass-inset flex flex-col gap-6 rounded-8 p-8'>
          <div className='aspect-square w-full animate-pulse rounded-8 bg-black/[0.07]' />
          <div className='h-13 w-3/5 animate-pulse rounded-4 bg-black/[0.07]' />
          <div className='h-11 w-2/5 animate-pulse rounded-4 bg-black/[0.07]' />
        </div>
      ))}
    </div>
  )
}

function formatTokenId(tokenId: string | null | undefined): string {
  if (!tokenId) return '-'
  if (tokenId.length <= 12) return tokenId
  return `${tokenId.slice(0, 8)}…`
}
