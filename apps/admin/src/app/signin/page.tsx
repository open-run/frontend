'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import {
  COOKIE,
  removeCookie,
  setCookie,
  smartWalletLogin,
  type SmartWalletLoginResponse,
} from '@openrun/api-client'
import { LoadingLogo } from '@openrun/ui'

export default function AdminSignInPage() {
  const router = useRouter()
  const { open } = useAppKit()
  const { address, isConnected, status } = useAppKitAccount({ namespace: 'eip155' })
  const { disconnect } = useDisconnect()
  const [hasInitiated, setHasInitiated] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const hasMutatedRef = useRef(false)

  const { mutate, isPending } = useMutation<SmartWalletLoginResponse, Error, string>({
    mutationFn: (walletAddress: string) => smartWalletLogin({ code: walletAddress }),
    onSuccess: ({ data }) => {
      setCookie(COOKIE.ACCESSTOKEN, data.jwtToken, 60 * 60 * 6)
      router.replace('/')
    },
    onError: (error: Error) => {
      hasMutatedRef.current = false
      setHasInitiated(false)
      setErrorMessage(getErrorMessage(error))
    },
  })

  useEffect(() => {
    removeCookie(COOKIE.ACCESSTOKEN)
    void disconnect({ namespace: 'eip155' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!hasInitiated || !isConnected || !address) return
    if (isPending || hasMutatedRef.current) return
    hasMutatedRef.current = true
    mutate(address)
  }, [hasInitiated, isConnected, address, isPending, mutate])

  const handleConnectClick = () => {
    setErrorMessage(null)
    hasMutatedRef.current = false
    setHasInitiated(true)
    open()
  }

  const isLoading =
    isPending || (hasInitiated && (status === 'connecting' || status === 'reconnecting'))

  return (
    <main className='flex min-h-dvh flex-col items-center justify-center bg-gray-lighten px-16'>
      <section className='flex w-full max-w-[420px] flex-col gap-20 rounded-12 bg-white p-32 shadow-floating-primary'>
        <header className='flex flex-col gap-6'>
          <h1 className='text-24 font-bold text-black'>OpenRun Admin</h1>
          <p className='text-14 text-gray-darkest'>관리자 권한 지갑으로 로그인하세요.</p>
        </header>

        <button
          type='button'
          className='flex h-48 w-full items-center justify-center rounded-8 bg-primary text-15 font-bold text-white active:bg-primary-darken disabled:bg-gray disabled:text-gray-lighten'
          disabled={isLoading}
          onClick={handleConnectClick}>
          {isLoading ? <LoadingLogo className='w-120' /> : '지갑 연결하고 로그인'}
        </button>

        {errorMessage && (
          <p className='rounded-8 border border-pink/30 bg-pink/10 p-12 text-12 font-bold text-pink'>
            {errorMessage}
          </p>
        )}

        <p className='text-12 text-gray-darkest'>
          관리자 화이트리스트에 등록된 지갑만 접근 가능합니다. 일반 사용자 페이지는{' '}
          <a className='text-primary underline' href='https://www.open-run.xyz'>
            www.open-run.xyz
          </a>
          를 이용해 주세요.
        </p>
      </section>
    </main>
  )
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return '로그인에 실패했습니다.'
}
