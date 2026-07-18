import { queryOptions, useQuery } from '@tanstack/react-query'
import { usePermissionStore } from '@store/permission'
import { Geolocation } from '@type/geolocation'
import { BridgeMessage, postMessageToRN } from '@shared/AppBridge'
import { MESSAGE } from '@constants/app'

// 위치 정보 캐싱 설정
const GEOLOCATION_CACHE_TIME = 10 * 60 * 1000 // 10분
const GEOLOCATION_STALE_TIME = 5 * 60 * 1000 // 5분
const GEOLOCATION_RETRY_COUNT = 1
const GEOLOCATION_RETRY_DELAY = 1000

// 앱 환경에서 위치 정보를 가져오는 함수
const getAppLocation = (): Promise<Geolocation> => {
  return new Promise((resolve, reject) => {
    // 브릿지가 없으면 postMessageToRN이 조용히 no-op이라 응답이 영원히 오지 않는다 — 즉시 실패시킨다
    if (typeof window === 'undefined' || !window.ReactNativeWebView) {
      reject(new Error('앱 브릿지를 사용할 수 없습니다'))
      return
    }

    const onMessageHandler = (event: MessageEvent) => {
      try {
        const parsedMessage = JSON.parse(event.data) as BridgeMessage
        switch (parsedMessage.type) {
          case MESSAGE.GEOLOCATION:
            clearTimeout(timeoutId)
            window.removeEventListener('message', onMessageHandler as EventListener)
            document.removeEventListener('message', onMessageHandler as EventListener)
            resolve(parsedMessage.data as Geolocation)
            break
          case MESSAGE.GEOLOCATION_ERROR:
            clearTimeout(timeoutId)
            window.removeEventListener('message', onMessageHandler as EventListener)
            document.removeEventListener('message', onMessageHandler as EventListener)
            reject(new Error('앱에서 위치 정보를 가져올 수 없습니다'))
            break
        }
      } catch (error) {
        console.error('메시지 파싱 오류:', error)
      }
    }

    const timeoutId = setTimeout(() => {
      // 타임아웃 시에도 리스너를 정리해 재시도마다 리스너가 누적되지 않게 한다
      window.removeEventListener('message', onMessageHandler as EventListener)
      document.removeEventListener('message', onMessageHandler as EventListener)
      reject(new Error('위치 정보 요청 시간 초과'))
    }, 20000) // 20초 타임아웃

    // iOS와 Android 모두 지원하기 위해 window와 document에 이벤트 리스너 추가
    window.addEventListener('message', onMessageHandler as EventListener)
    document.addEventListener('message', onMessageHandler as EventListener)

    // 앱에 위치 정보 요청
    postMessageToRN({ type: MESSAGE.REQUEST_GEOLOCATION })
  })
}

// 브라우저 환경에서 위치 정보를 가져오는 함수
const getBrowserLocation = (): Promise<Geolocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('이 브라우저는 위치 정보를 지원하지 않습니다'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (err) => {
        if (err instanceof GeolocationPositionError) {
          switch (err.code) {
            case GeolocationPositionError.PERMISSION_DENIED:
              reject(new Error('[위치 정보 권한 거부] 브라우저 설정에서 위치 정보 접근 권한을 허용해주세요'))
              break
            case GeolocationPositionError.POSITION_UNAVAILABLE:
              reject(
                new Error(
                  '[위치 정보 사용 불가] 현재 위치를 확인할 수 없습니다. 인터넷 연결을 확인하거나 GPS가 켜져있는지 확인해주세요',
                ),
              )
              break
            case GeolocationPositionError.TIMEOUT:
              reject(
                new Error(
                  '[위치 정보 요청 시간 초과] 위치 정보를 가져오는 데 너무 오래 걸립니다. 네트워크 상태를 확인해주세요',
                ),
              )
              break
            default:
              reject(new Error('위치 정보를 가져오는 중 오류가 발생했습니다'))
          }
        } else {
          reject(new Error('위치 정보를 가져오는 중 오류가 발생했습니다'))
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5 * 60 * 1000, // 5분 캐시 허용
        timeout: 10000, // 10초 타임아웃
      },
    )
  })
}

export default function useGeolocation() {
  const { setIsGeolocationPermissionGranted } = usePermissionStore()

  // 경로 판단은 isApp(신원)이 아니라 실제 전송 수단인 window.ReactNativeWebView 존재 여부로 한다 —
  // 브릿지가 없는 환경(일반 브라우저, 카카오톡 등 서드파티 인앱 브라우저)은 브라우저 경로를 탄다.
  const hasAppBridge = typeof window !== 'undefined' && !!window.ReactNativeWebView

  // React Query를 사용한 위치 정보 캐싱
  const geolocationQueryOptions = queryOptions({
    // 환경을 키에 포함해, 판별이 뒤늦게 바뀌어도 올바른 경로로 재요청되게 한다
    queryKey: ['geolocation', hasAppBridge],
    queryFn: async (): Promise<Geolocation> => {
      try {
        const result = hasAppBridge ? await getAppLocation() : await getBrowserLocation()
        setIsGeolocationPermissionGranted(true)
        return result
      } catch (err) {
        setIsGeolocationPermissionGranted(false)

        // 개발 환경에서 특정 에러 처리
        if (process.env.NODE_ENV === 'development' && !hasAppBridge) {
          const errorMessage = err instanceof Error ? err.message : String(err)
          if (errorMessage.includes('POSITION_UNAVAILABLE') || errorMessage.includes('[위치 정보 사용 불가]')) {
            console.warn('개발 환경에서는 에러 발생 시 임시 위치 정보 권한 허용')
            setIsGeolocationPermissionGranted(true)
            // 기본 위치(서울시청)로 설정
            return {
              lat: 37.577956,
              lng: 126.916561,
            }
          }
        }

        throw err
      }
    },
    staleTime: GEOLOCATION_STALE_TIME,
    gcTime: GEOLOCATION_CACHE_TIME,
    retry: GEOLOCATION_RETRY_COUNT,
    retryDelay: GEOLOCATION_RETRY_DELAY,
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 재요청 비활성화
    refetchOnReconnect: true, // 네트워크 재연결 시 재요청 활성화
  })
  const {
    data: location,
    isLoading,
    error,
    refetch,
  } = useQuery(geolocationQueryOptions)

  return {
    location: location || null,
    isLoading,
    error,
    refetch,
  }
}
