'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { useUserStore } from '@store/user'
import { useUserInfo } from '@apis/v1/users/query'
import { COOKIE } from '@constants/cookie'
import { removeCookie } from '@utils/cookie'
import LoadingLogo from './LoadingLogo'

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { userInfo, setUserInfo } = useUserStore()

  const query = useUserInfo({
    onSuccess: ({ data }) => {
      if (data?.nickname == null) {
        router.replace('/signin')
      }

      setUserInfo(data)
    },
  })

  // /v1/users가 retry 후에도 실패하면 (JWT 만료, 5xx, 네트워크 단절 등) 무한 LoadingLogo에 갇히지 않도록
  // cookie를 정리하고 signin으로 보낸다. middleware는 쿠키 "존재"만 보므로 client-side에서 만료를 감지해야 한다.
  useEffect(() => {
    if (query.isError) {
      removeCookie(COOKIE.ACCESSTOKEN)
      router.replace('/signin')
    }
  }, [query.isError, router])

  // 인증은 cookie의 JWT(middleware에서 검증)와 백엔드 user 정보로 충분하다.
  // Reown wallet 상태는 더 이상 게이트에 영향을 주지 않는다 — wallet은 로그인/로그아웃 시점에만 사용된다.
  if (userInfo.nickname == null) {
    return (
      <div className='flex h-full w-full items-center justify-center bg-gradient-primary-white'>
        <LoadingLogo className='text-white' />
      </div>
    )
  }

  return children
}
