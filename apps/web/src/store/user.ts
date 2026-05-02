import { create } from 'zustand'
import { UserInfo } from '@type/user'

type User = {
  // <AuthGuard>에서 userInfo가 null이 아님을 보장
  userInfo: UserInfo
  setUserInfo: (userInfo: UserInfo) => void
}

export const useUserStore = create<User>()((set) => ({
  userInfo: {} as UserInfo,
  setUserInfo: (userInfo: UserInfo) => set(() => ({ userInfo })),
}))
