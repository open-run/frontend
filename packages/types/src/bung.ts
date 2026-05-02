export type BungInfo = {
  bungId: string
  mainImage: string
  name: string
  description: string
  location: string
  latitude: number
  longitude: number
  startDateTime: string
  endDateTime: string
  distance: number
  pace: string
  memberNumber: number
  currentMemberCount: number
  hasAfterRun: boolean
  afterRunDescription: string
  hashtags: string[]
  memberList: BungMember[]
}

export type BungMember = {
  userId: string
  nickname: string
  email: string
  profileImageUrl: string | null
  likeCount: number
  participationStatus: boolean
  owner: boolean
}
