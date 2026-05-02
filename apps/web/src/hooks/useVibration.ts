import { useCallback } from 'react'
import { useAppStore } from '@store/app'
import { MESSAGE, VIBRATION_TYPE } from '@constants/app'
import { postMessageToRN } from '@components/shared/AppBridge'

/**
 * 진동을 호출하는 커스텀 훅
 * @returns 진동을 호출하는 함수
 */
export function useVibration() {
  const { isApp } = useAppStore()

  const vibrate = useCallback(
    (vibrationType: VIBRATION_TYPE = VIBRATION_TYPE.IMPACT_MEDIUM) => {
      if (!isApp) {
        console.log('🌐 [Web] Not in app environment, skipping vibration')
        return
      }

      console.log('📱 [Web] Sending vibration request to native app:', vibrationType)
      postMessageToRN({
        type: MESSAGE.REQUEST_VIBRATION,
        data: {
          vibrationType,
        },
      })
    },
    [isApp],
  )

  return vibrate
}
