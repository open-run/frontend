'use client'

import { ReactNode, useCallback, useEffect } from 'react'
import { useAppStore } from '@store/app'
import { MESSAGE } from '@constants/app'

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage(message: string): void
    }
  }
}

export type BridgeMessage<T = unknown> = {
  type: MESSAGE
  data: T
}

export type VibrationMessage = {
  type: MESSAGE.REQUEST_VIBRATION
  data: {
    vibrationType: string
  }
}

const extractBridgePayload = (event: MessageEvent): unknown => {
  const candidate = (event as MessageEvent & { nativeEvent?: { data?: unknown } }).data
    ?? (event as MessageEvent & { nativeEvent?: { data?: unknown } }).nativeEvent?.data

  if (typeof candidate === 'string') {
    try {
      return JSON.parse(candidate)
    } catch {
      return null
    }
  }

  return candidate
}

export default function AppBridge({ children }: { children: ReactNode }) {
  const { setIsApp, setInsets } = useAppStore()
  const setBodyAppClass = useCallback((enabled: boolean) => {
    document.body.classList.toggle('app', enabled)
  }, [])

  const markAsApp = useCallback(() => {
    setIsApp(true)
    setBodyAppClass(true)
  }, [setBodyAppClass, setIsApp])

  const markAsBrowser = useCallback(() => {
    setIsApp(false)
    setBodyAppClass(false)
  }, [setBodyAppClass, setIsApp])

  const isBridgeMessageType = useCallback((type: unknown): type is MESSAGE => {
    return typeof type === 'string' && (Object.values(MESSAGE) as string[]).includes(type)
  }, [])

  /* 앱 여부 설정 */
  useEffect(() => {
    if (checkIsApp()) {
      markAsApp()
    } else {
      markAsBrowser()
    }

    // iOS WebView에서 bridge 객체 주입 타이밍이 늦는 경우를 보완
    const pollingInterval = window.setInterval(() => {
      if (checkIsApp()) {
        markAsApp()
        window.clearInterval(pollingInterval)
      }
    }, 500)
    const pollingTimeout = window.setTimeout(() => {
      window.clearInterval(pollingInterval)
    }, 10000)

    if (process.env.NODE_ENV === 'development') {
      import('eruda').then((eruda) => {
        eruda.default.init()
      })
    }

    return () => {
      window.clearInterval(pollingInterval)
      window.clearTimeout(pollingTimeout)
    }
  }, [markAsApp, markAsBrowser])

  /* 앱에서 전달되는 메시지 처리 (inset 값 등) */
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const parsedMessage = extractBridgePayload(event) as Partial<BridgeMessage> | null
        if (parsedMessage == null) {
          return
        }

        if (!isBridgeMessageType(parsedMessage.type)) {
          return
        }

        markAsApp()

        if (parsedMessage.type === MESSAGE.INSET) {
          const insetData = parsedMessage.data as { top?: number; bottom?: number }
          if (typeof insetData?.top !== 'number' || typeof insetData?.bottom !== 'number') {
            return
          }
          console.log('📱 [AppBridge] Received inset values from native app:', insetData)
          setInsets({ top: insetData.top, bottom: insetData.bottom })
        }
      } catch (error) {
        // 메시지 파싱 실패는 무시 (다른 메시지일 수 있음)
      }
    }

    // iOS와 Android 모두 지원하기 위해 window와 document에 이벤트 리스너 추가
    window.addEventListener('message', handleMessage as EventListener)
    document.addEventListener('message', handleMessage as EventListener)

    return () => {
      window.removeEventListener('message', handleMessage as EventListener)
      document.removeEventListener('message', handleMessage as EventListener)
    }
  }, [isBridgeMessageType, markAsApp, setInsets])

  return children
}

export const checkIsApp = () => {
  if (typeof window === 'undefined') return false

  const webkitWindow = window as Window & {
    webkit?: { messageHandlers?: { ReactNativeWebView?: unknown } }
  }
  const isReactNativeWebView = !!window.ReactNativeWebView
  const isAndroidWebView = /wv/.test(navigator.userAgent)
  const isIOSWebView = !!webkitWindow.webkit?.messageHandlers?.ReactNativeWebView

  return isReactNativeWebView || isAndroidWebView || isIOSWebView
}

export const postMessageToRN = (payload: any) => {
  if (typeof window === 'undefined' || !window.ReactNativeWebView) {
    console.log('⚠️ [Web] Cannot send message - not in app environment')
    return
  }
  const messageString = JSON.stringify(payload)
  console.log('📤 [Web] Sending message to React Native:', payload)
  console.log('📤 [Web] Message string:', messageString)
  window.ReactNativeWebView.postMessage(messageString)
}
