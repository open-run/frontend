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

export type OutgoingBridgeMessage = {
  type: MESSAGE
  data?: unknown
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
  const { setInsets } = useAppStore()

  const isBridgeMessageType = useCallback((type: unknown): type is MESSAGE => {
    return typeof type === 'string' && (Object.values(MESSAGE) as string[]).includes(type)
  }, [])

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('eruda').then((eruda) => {
        eruda.default.init()
      })
    }
  }, [])

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

        if (parsedMessage.type === MESSAGE.INSET) {
          const insetData = parsedMessage.data as { top?: number; bottom?: number }
          if (typeof insetData?.top !== 'number' || typeof insetData?.bottom !== 'number') {
            return
          }
          setInsets({ top: insetData.top, bottom: insetData.bottom })
        }
      } catch {
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
  }, [isBridgeMessageType, setInsets])

  return children
}

export const postMessageToRN = (payload: OutgoingBridgeMessage) => {
  if (typeof window === 'undefined' || !window.ReactNativeWebView) {
    return
  }
  const messageString = JSON.stringify(payload)
  window.ReactNativeWebView.postMessage(messageString)
}
