import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { COOKIE, setCookie, smartWalletLogin } from '@openrun/api-client'

export function useSmartWalletLogin() {
  const router = useRouter()
  return useMutation({
    mutationFn: smartWalletLogin,
    onSuccess: ({ data }) => {
      setCookie(COOKIE.ACCESSTOKEN, data.jwtToken, 60 * 60 * 6)
      router.replace('/')
    },
  })
}
