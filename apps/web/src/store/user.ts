import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserInfo } from '@type/user'

type User = {
  // <AuthGuard>에서 userInfo가 null이 아님을 보장
  userInfo: UserInfo
  setUserInfo: (userInfo: UserInfo) => void
  resetUserInfo: () => void
}

const EMPTY_USER_INFO = {} as UserInfo

export const useUserStore = create<User>()(
  persist(
    (set) => ({
      userInfo: EMPTY_USER_INFO,
      setUserInfo: (userInfo: UserInfo) => set(() => ({ userInfo })),
      resetUserInfo: () => set(() => ({ userInfo: EMPTY_USER_INFO })),
    }),
    {
      name: 'openrun:user-store',
      // 토큰은 cookie에만 두고, 여기엔 인증과 무관한 사용자 표시 정보만 보관한다.
      partialize: (state) => ({ userInfo: state.userInfo }),
    },
  ),
)
