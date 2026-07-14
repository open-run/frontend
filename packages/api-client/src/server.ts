import 'server-only'

import { cookies } from 'next/headers'
import { COOKIE } from './constants'
import { createHttpClient } from './core'

export { COOKIE }

const http = createHttpClient({
  // SSR 전용 백엔드 주소. 컨테이너 배포 시 API_SERVER_URL(비공개, 런타임)로 내부 네트워크(http://openrun:8080)를
  // 가리키고, 그 외 환경에서는 NEXT_PUBLIC_API_SERVER_URL(빌드 타임 인라인)로 폴백한다.
  baseURL: process.env.API_SERVER_URL || process.env.NEXT_PUBLIC_API_SERVER_URL,
  getHeaders: async () => {
    const token = (await cookies()).get(COOKIE.ACCESSTOKEN)?.value
    return token ? { Authorization: token } : undefined
  },
})

export default http
