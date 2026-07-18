import { Avatar, SubCategory, WearingAvatar } from '@openrun/types'

export const EMPTY_WEARING_AVATAR: WearingAvatar = {
  upperClothing: null,
  lowerClothing: null,
  fullSet: null,
  footwear: null,
  face: null,
  skin: null,
  hair: null,
  accessories: {
    'head-accessories': null,
    'ear-accessories': null,
    'body-accessories': null,
    'eye-accessories': null,
  },
}

export function toggleWearingAvatar(wearing: WearingAvatar, part: Avatar): WearingAvatar {
  if (part.mainCategory === 'accessories') {
    const subCategory = part.subCategory as SubCategory
    const currentPart = wearing.accessories[subCategory]

    return {
      ...wearing,
      accessories: {
        ...wearing.accessories,
        [subCategory]: currentPart?.id === part.id ? null : part,
      },
    }
  }

  const currentPart = wearing[part.mainCategory]

  return {
    ...wearing,
    [part.mainCategory]: currentPart?.id === part.id ? null : part,
  }
}

export function isWearingAvatar(wearing: WearingAvatar, part: Avatar): boolean {
  if (part.mainCategory === 'accessories') {
    return wearing.accessories[part.subCategory as SubCategory]?.id === part.id
  }

  return wearing[part.mainCategory]?.id === part.id
}

export function getWearableImageUrls(part: Avatar): string[] {
  if (Array.isArray(part.imageUrl)) {
    return part.imageUrl.filter(isPresentImageUrl)
  }

  return isPresentImageUrl(part.imageUrl) ? [part.imageUrl] : []
}

export function hasWearableImage(part: Avatar): boolean {
  return getWearableImageUrls(part).length > 0
}

export function hasThumbnailImage(part: Avatar): boolean {
  return isPresentImageUrl(part.thumbnailUrl)
}

export function uniqueImageUrls(imageUrls: string[]): string[] {
  return Array.from(new Set(imageUrls))
}

function isPresentImageUrl(imageUrl: string | null | undefined): imageUrl is string {
  return imageUrl != null && imageUrl !== ''
}
