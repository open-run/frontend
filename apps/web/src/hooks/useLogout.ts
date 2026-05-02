import { useCallback } from 'react'

import { useRouter } from 'next/navigation'
import { removeCookie } from '@utils/cookie'
import { COOKIE } from '@constants/cookie'

export default function useLogout() {
  const router = useRouter()

  const logout = useCallback(() => {
    removeCookie(COOKIE.ACCESSTOKEN)
    router.replace('/signin')
  }, [router])

  return { logout }
}
