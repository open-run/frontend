import { useCallback } from 'react'
import { useAppEnv } from '@contexts/AppEnvProvider'
import { MESSAGE, VIBRATION_TYPE } from '@constants/app'
import { postMessageToRN } from '@components/shared/AppBridge'

/**
 * 진동을 호출하는 커스텀 훅
 * @returns 진동을 호출하는 함수
 */
export function useVibration() {
  const { isApp } = useAppEnv()

  const vibrate = useCallback(
    (vibrationType: VIBRATION_TYPE = VIBRATION_TYPE.IMPACT_MEDIUM) => {
      if (!isApp) {
        return
      }

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
