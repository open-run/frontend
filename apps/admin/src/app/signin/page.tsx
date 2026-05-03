'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import {
  AccountController,
  ChainController,
  ConnectionController,
  ConnectorController,
  StorageUtil,
  type Connector,
} from '@reown/appkit-controllers'
import {
  COOKIE,
  buildReownSocialRedirectUri,
  consumePendingReownSocialProvider,
  hasPendingReownSocialRedirect,
  removeCookie,
  setCookie,
  smartWalletLogin,
  storePendingReownSocialProvider,
  type ReownSocialProvider,
  type SmartWalletLoginResponse,
} from '@openrun/api-client'
import { LoadingLogo } from '@openrun/ui'

type SocialAuthConnector = Connector & {
  provider?: {
    getSocialRedirectUri?: (params: { provider: ReownSocialProvider }) => Promise<{ uri?: string }>
  }
}

const SOCIAL_OPTIONS: { id: ReownSocialProvider; label: string }[] = [
  { id: 'google', label: 'Google' },
  { id: 'apple', label: 'Apple' },
  { id: 'discord', label: 'Discord' },
  { id: 'github', label: 'GitHub' },
]

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
    let cancelled = false

    async function bootstrap() {
      if (!hasPendingReownSocialRedirect()) {
        removeCookie(COOKIE.ACCESSTOKEN)
        void disconnect({ namespace: 'eip155' })
        return
      }

      const url = new URL(window.location.href)
      const resultUri = url.searchParams.get('result_uri')
      const socialProvider = consumePendingReownSocialProvider()

      if (resultUri == null || socialProvider == null) return

      hasMutatedRef.current = false
      setHasInitiated(true)
      url.searchParams.delete('result_uri')
      window.history.replaceState({}, document.title, url.toString())

      try {
        const authConnector = await waitForAuthConnector(() => cancelled)
        if (cancelled) return

        AccountController.setSocialProvider(socialProvider, ChainController.state.activeChain)
        await ConnectionController.connectExternal(
          { id: authConnector.id, type: authConnector.type, socialUri: resultUri },
          authConnector.chain,
        )
        StorageUtil.setConnectedSocialProvider(
          socialProvider as Parameters<typeof StorageUtil.setConnectedSocialProvider>[0],
        )
        await ConnectionController.connectExternal(authConnector, authConnector.chain)
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error))
          setHasInitiated(false)
        }
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!hasInitiated || !isConnected || !address) return
    if (isPending || hasMutatedRef.current) return
    hasMutatedRef.current = true
    mutate(address)
  }, [hasInitiated, isConnected, address, isPending, mutate])

  const handleWalletClick = () => {
    setErrorMessage(null)
    hasMutatedRef.current = false
    setHasInitiated(true)
    open()
  }

  const handleSocialClick = async (provider: ReownSocialProvider) => {
    setErrorMessage(null)
    hasMutatedRef.current = false
    setHasInitiated(true)
    try {
      const authConnector = (await waitForAuthConnector(() => false)) as SocialAuthConnector
      const getRedirectUri = authConnector.provider?.getSocialRedirectUri
      if (typeof getRedirectUri !== 'function') {
        throw new Error('소셜 로그인을 사용할 수 없습니다.')
      }
      const result = await getRedirectUri({ provider })
      if (!result?.uri) throw new Error('리다이렉트 URI를 받지 못했습니다.')
      const finalUri = buildReownSocialRedirectUri(result.uri, window.location.href)
      storePendingReownSocialProvider(provider)
      window.location.href = finalUri
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
      setHasInitiated(false)
    }
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
          onClick={handleWalletClick}>
          {isLoading ? <LoadingLogo className='w-120' /> : '지갑 연결하고 로그인'}
        </button>

        <div className='flex items-center gap-10'>
          <span className='h-px flex-1 bg-gray' />
          <span className='text-12 text-gray-darkest'>또는 소셜 로그인</span>
          <span className='h-px flex-1 bg-gray' />
        </div>

        <div className='grid grid-cols-2 gap-8'>
          {SOCIAL_OPTIONS.map((option) => (
            <button
              key={option.id}
              type='button'
              disabled={isLoading}
              onClick={() => handleSocialClick(option.id)}
              className='flex h-44 items-center justify-center rounded-8 border border-gray text-13 font-bold text-black-darken active:bg-gray-lighten disabled:opacity-50'>
              {option.label}
            </button>
          ))}
        </div>

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

async function waitForAuthConnector(isCancelled: () => boolean) {
  for (let i = 0; i < 20; i += 1) {
    const authConnector = ConnectorController.getAuthConnector()
    if (authConnector != null) return authConnector
    if (isCancelled()) break
    await new Promise((resolve) => window.setTimeout(resolve, 250))
  }
  throw new Error('소셜 인증 connector를 찾을 수 없습니다.')
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return '로그인에 실패했습니다.'
}
