import Image from 'next/image'
import { Rarity } from '@type/avatar'

export default function RarityIcon({ rarity, size, className }: { rarity: Rarity; size?: number; className?: string }) {
  switch (rarity) {
    case 'common':
      return null
    case 'rare':
      return (
        <Image className={className} src='/images/avatars/icon_rarity_rare.png' alt='rare' width={size} height={size} />
      )
    case 'epic':
      return (
        <Image className={className} src='/images/avatars/icon_rarity_epic.png' alt='epic' width={size} height={size} />
      )
    default:
      return null
  }
}
