'use client'

import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useAppStore } from '@store/app'
import { SmartWalletConnectResponse } from '@type/app'
import { postMessageToRN } from '@shared/AppBridge'
import LoadingLogo from '@shared/LoadingLogo'
import { useMessageHandler } from '@hooks/useMessageHandler'
import { useSmartWalletLogin } from '@apis/auth/smartWalletLogin/mutation'
import { removeCookie } from '@utils/cookie'
import { MESSAGE } from '@constants/app'
import { COOKIE } from '@constants/cookie'
import { colors } from '@styles/colors'

export default function Signin() {
  const { isApp } = useAppStore()
  return isApp ? <SignInApp /> : <SignInBrowser />
}

function SignInApp() {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate: smartWalletLogin } = useSmartWalletLogin()

  useMessageHandler(({ type, data }) => {
    switch (type) {
      case MESSAGE.RESPONSE_SMART_WALLET_CONNECT:
        smartWalletLogin({ address: data as SmartWalletConnectResponse })
        break

      case MESSAGE.RESPONSE_SMART_WALLET_CONNECT_ERROR:
        setIsLoading(false)
        break
    }
  })

  useEffect(() => {
    removeCookie(COOKIE.ACCESSTOKEN)
    postMessageToRN({ type: MESSAGE.DISCONNECT_SMART_WALLET })
  }, [])

  return (
    <div className='absolute bottom-56 w-full px-16'>
      <SmartWalletLoginButton
        isLoading={isLoading}
        onClick={() => {
          setIsLoading(true)
          postMessageToRN({ type: MESSAGE.REQUEST_SMART_WALLET_CONNECT })
        }}
      />
    </div>
  )
}

function SignInBrowser() {
  const { address } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [isLoading, setIsLoading] = useState(false)

  const { mutate: smartWalletLogin } = useSmartWalletLogin()

  const handleLoginButtonClick = () => {
    setIsLoading(true)

    if (address) {
      smartWalletLogin({ address: address })
      return
    }

    connect(
      { connector: connectors[0] },
      {
        onSuccess: (data) => {
          setIsLoading(false)
          const address = data.accounts[0]
          smartWalletLogin({ address: address })
        },
      },
    )
  }

  useEffect(() => {
    removeCookie(COOKIE.ACCESSTOKEN)
    address && disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='absolute bottom-40 w-full px-16'>
      <SmartWalletLoginButton isLoading={isLoading} onClick={handleLoginButtonClick} />
    </div>
  )
}

function SmartWalletLoginButton({ isLoading, onClick }: { isLoading: boolean; onClick?: () => void }) {
  return (
    <button
      className='relative flex h-56 w-full items-center justify-center gap-8 rounded-8 bg-primary hover:bg-primary/90'
      disabled={isLoading}
      onClick={onClick}>
      <span className='absolute -top-16 rounded-12 border border-primary bg-white px-12 py-4 text-12 font-semibold'>
        NFT 보상을 받기 위한 전용 월렛이 필요해요
      </span>
      <span className='text-16 font-bold text-white'>
        {isLoading ? <LoadingLogo color={colors.white} className='mx-auto' /> : '월렛 만들고 시작하기'}
      </span>
    </button>
  )
}
