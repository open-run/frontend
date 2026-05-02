export type UserInfo = {
  userId: string
  withdraw: boolean
  nickname: string
  email: string
  identityAuthenticated: boolean
  provider: string
  createdDate: string
  lastLoginDate: string
  blockchainAddress: string
  runningPace: string
  runningFrequency: number
  profileImageUrl: string | null
}
