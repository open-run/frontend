export const checkGeolocationPermission = async (): Promise<boolean> => {
  try {
    // 권한 API 지원 확인
    if (!navigator.permissions || !navigator.permissions.query) {
      return false
    }

    const result = await navigator.permissions.query({ name: 'geolocation' })
    return result.state === 'granted'
  } catch (error) {
    console.error('위치 권한 확인 중 오류:', error)
    return false
  }
}

export const requestGeolocationPermission = (): Promise<boolean> => {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      () => resolve(true), // 권한 허용됨
      () => resolve(false), // 권한 거부됨
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    )
  })
}
