import { useEffect } from 'react'
import { useAppStore } from '@store/app'
import { BridgeMessage } from '@shared/AppBridge'

type MessageHandler = (parsedMessage: BridgeMessage<any>) => void

export const useMessageHandler = (messageHandler: MessageHandler) => {
  const { isApp } = useAppStore()
  useEffect(() => {
    if (!isApp) return
    const onMessageHandler = (event: MessageEvent) => {
      try {
        const parsedMessage = JSON.parse(event.data)
        messageHandler(parsedMessage)
      } catch (error) {
        console.error('메시지 파싱 오류:', error)
      }
    }

    // iOS와 Android 모두 지원하기 위해 window와 document에 이벤트 리스너 추가
    window.addEventListener('message', onMessageHandler as EventListener)
    document.addEventListener('message', onMessageHandler as EventListener)

    return () => {
      window.removeEventListener('message', onMessageHandler as EventListener)
      document.removeEventListener('message', onMessageHandler as EventListener)
    }
  }, [messageHandler, isApp])
}
