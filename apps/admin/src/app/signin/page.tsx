'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppKitAccount, useAppKitState, useDisconnect } from '@reown/appkit/react'
import {
  AccountController,
  ChainController,
  ConnectionController,
  ConnectorController,
  StorageUtil,
  type Connector,
} from '@reown/appkit-controllers'
import { useModal } from '@contexts/ModalProvider'
import { useSmartWalletLogin } from '@apis/v1/users/login/smart_wallet/mutation'
import {
  consumePendingReownSocialProvider,
  hasPendingReownSocialRedirect,
  type ReownSocialProvider,
} from '@openrun/api-client/reownSocialRedirect'
import { COOKIE } from '@openrun/api-client/constants'
import { removeCookie } from '@openrun/api-client/cookie'
import { LoadingLogo } from '@openrun/ui'
import { MODAL_KEY } from '@constants/modal'
import WalletLoginBottomSheet from '@components/signin/WalletLoginBottomSheet'

type SocialAuthConnector = Connector & {
  provider?: {
    getSocialRedirectUri?: (params: { provider: ReownSocialProvider }) => Promise<{ uri?: string }>
  }
}

export default function AdminSignInPage() {
  const { showModal, closeModal } = useModal()
  const { open: isAppKitModalOpen } = useAppKitState()
  const { address, isConnected, status } = useAppKitAccount({ namespace: 'eip155' })
  const { disconnect } = useDisconnect()
  const [isLoading, setIsLoading] = useState(false)
  const hasRequestedLoginRef = useRef(false)
  const hasObservedModalOpenRef = useRef(false)

  const { mutate: smartWalletLogin } = useSmartWalletLogin()

  const loginWithAddress = useCallback(
    (walletAddress: string) => {
      hasRequestedLoginRef.current = false
      smartWalletLogin(
        { code: walletAddress },
        {
          onError: () => {
            setIsLoading(false)
          },
        },
      )
    },
    [smartWalletLogin],
  )

  const stopWalletConnect = useCallback(() => {
    hasRequestedLoginRef.current = false
    hasObservedModalOpenRef.current = false
    setIsLoading(false)
  }, [])

  const handleLoginButtonClick = () => {
    if (isConnected && address) {
      setIsLoading(true)
      loginWithAddress(address)
      return
    }

    showModal({
      key: MODAL_KEY.WALLET_LOGIN,
      component: (
        <WalletLoginBottomSheet
          onConnectStart={() => {
            hasRequestedLoginRef.current = true
            hasObservedModalOpenRef.current = false
            setIsLoading(true)
          }}
          onConnectError={stopWalletConnect}
          onConnectSuccess={() => undefined}
          onCancel={stopWalletConnect}
        />
      ),
    })
  }

  useEffect(() => {
    removeCookie(COOKIE.ACCESSTOKEN)
    if (!hasPendingReownSocialRedirect()) {
      void disconnect({ namespace: 'eip155' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let cancelled = false

    async function connectSocialRedirect() {
      const url = new URL(window.location.href)
      const resultUri = url.searchParams.get('result_uri')
      const socialProvider = consumePendingReownSocialProvider()

      if (resultUri == null || socialProvider == null) {
        return
      }

      hasRequestedLoginRef.current = true
      hasObservedModalOpenRef.current = false
      setIsLoading(true)
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
      } catch {
        if (!cancelled) {
          stopWalletConnect()
        }
      }
    }

    void connectSocialRedirect()

    return () => {
      cancelled = true
    }
  }, [stopWalletConnect])

  useEffect(() => {
    if (!hasRequestedLoginRef.current || !isConnected || !address) {
      return
    }

    closeModal(MODAL_KEY.WALLET_LOGIN)
    loginWithAddress(address)
  }, [address, closeModal, isConnected, loginWithAddress])

  useEffect(() => {
    if (isAppKitModalOpen) {
      hasObservedModalOpenRef.current = true
      return
    }

    const isConnecting = status === 'connecting' || status === 'reconnecting'
    if (isLoading && hasObservedModalOpenRef.current && !isConnected && !isConnecting) {
      stopWalletConnect()
    }
  }, [isAppKitModalOpen, isConnected, isLoading, status, stopWalletConnect])

  return (
    <main className='admin-bg flex min-h-dvh flex-col items-center justify-center px-16'>
      <section className='glass-panel flex w-full max-w-[420px] flex-col gap-20 rounded-24 p-32'>
        <header className='flex flex-col gap-6'>
          <h1 className='text-24 font-bold text-[#1d1d1f]'>OpenRun Admin</h1>
          <p className='text-14 text-[#6e6e73]'>관리자 권한 지갑으로 로그인하세요.</p>
        </header>

        <button
          type='button'
          className='cta-gradient flex h-48 w-full items-center justify-center rounded-full text-14 font-bold text-white active:scale-[0.99] disabled:bg-gray disabled:bg-none disabled:text-gray-lighten disabled:shadow-none'
          disabled={isLoading}
          onClick={handleLoginButtonClick}>
          {isLoading ? <LoadingLogo className='w-120' /> : '지갑 연결하고 로그인'}
        </button>

        <p className='text-12 text-[#6e6e73]'>
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
