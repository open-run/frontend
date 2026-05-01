'use client'

import { redirect, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { useAppKitAccount } from '@reown/appkit/react'
import { useAppStore } from '@store/app'
import { useUserStore } from '@store/user'
import { useMessageHandler } from '@hooks/useMessageHandler'
import { useUserInfo } from '@apis/v1/users/query'
import { MESSAGE } from '@constants/app'
import { postMessageToRN } from './AppBridge'

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { userInfo, setUserInfo } = useUserStore()
  const address = useCheckAddress()

  useUserInfo({
    onSuccess: ({ data }) => {
      if (data?.nickname == null) {
        router.replace('/signin')
      }

      setUserInfo(data)
    },
  })

  if (userInfo.nickname == null || address === undefined) {
    return null
  }

  if (address === null) {
    // redirect('/signin')
  }

  return children
}

function useCheckAddress() {
  const { isApp } = useAppStore()
  const appAddress = useAppCheckAddress()
  const browserAddress = useBrowserCheckAddress()

  return isApp ? appAddress : browserAddress
}

function useAppCheckAddress() {
  const { isApp } = useAppStore()
  const [address, setAddress] = useState<string | null>()

  useMessageHandler(({ type, data }) => {
    switch (type) {
      case MESSAGE.RESPONSE_SMART_WALLET_CONNECT:
        setAddress(data)
        break

      case MESSAGE.RESPONSE_SMART_WALLET_CONNECT_ERROR:
        setAddress(null)
        break
    }
  })

  useEffect(() => {
    if (isApp) postMessageToRN({ type: MESSAGE.REQUEST_SMART_WALLET_CONNECT })
  }, [isApp])

  return address
}

function useBrowserCheckAddress() {
  const { address, isConnected, status } = useAppKitAccount({ namespace: 'eip155' })

  if (status === 'connecting' || status === 'reconnecting') {
    return undefined
  }

  return isConnected && address ? address : null
}
