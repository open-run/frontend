import { useCallback } from 'react'

import { useRouter } from 'next/navigation'
import { useDisconnect } from '@reown/appkit/react'
import { useUserStore } from '@store/user'
import { removeCookie } from '@utils/cookie'
import { COOKIE } from '@constants/cookie'

export default function useLogout() {
  const router = useRouter()
  const { disconnect } = useDisconnect()
  const resetUserInfo = useUserStore((state) => state.resetUserInfo)

  const logout = useCallback(() => {
    // Reown wallet은 로그인 시점에만 쓰이지만, 로그아웃에서는 명시적으로 끊어 connector 상태를 정리한다.
    void disconnect({ namespace: 'eip155' })
    resetUserInfo()
    removeCookie(COOKIE.ACCESSTOKEN)
    router.replace('/signin')
  }, [router, disconnect, resetUserInfo])

  return { logout }
}
