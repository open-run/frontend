import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useRouter } from 'next/navigation'
import { useDisconnect } from '@reown/appkit/react'
import { userQueries } from '@apis/v1/users/query'
import { removeCookie } from '@utils/cookie'
import { COOKIE } from '@constants/cookie'

export default function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { disconnect } = useDisconnect()

  const logout = useCallback(() => {
    // Reown wallet은 로그인 시점에만 쓰이지만, 로그아웃에서는 명시적으로 끊어 connector 상태를 정리한다.
    void disconnect({ namespace: 'eip155' })
    queryClient.removeQueries({ queryKey: userQueries.all() })
    window.localStorage.removeItem('openrun:user-store')
    removeCookie(COOKIE.ACCESSTOKEN)
    router.replace('/signin')
  }, [router, disconnect, queryClient])

  return { logout }
}
