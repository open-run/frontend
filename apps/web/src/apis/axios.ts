import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios'
import { COOKIE } from '@constants/cookie'

/**
 * 공통 API Response 타입 포맷 정의
 */
export type ApiResponse<DataType> = {
  message: string
  data: DataType
}

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
})

http.interceptors.request.use(async (request) => {
  const { method, url, params } = request

  /* null, undefined 값을 가진 파라미터 제거 */
  if (params != null) {
    request.params = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== null && value !== undefined),
    )
  }

  /* LOGGING */
  console.log(`🚀 [API] ${method?.toUpperCase()} ${url} | Request\n\n${JSON.stringify(request.params, null, 2)}\n`)

  /* HEADER CONFIG */
  let token
  if (typeof window === 'undefined') {
    /* At Server Component */
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    token = cookieStore.get(COOKIE.ACCESSTOKEN)?.value
  } else {
    /* At Client Component */
    const { getCookie } = await import('@utils/cookie')
    token = getCookie(COOKIE.ACCESSTOKEN)
  }

  /* 쿠키에 토큰 값이 있으면 헤더에 토큰을 넣어서 보냄 */
  if (token != null) {
    request.headers = new AxiosHeaders()
    request.headers['Authorization'] = token
  }

  return request
})

http.interceptors.response.use(
  /* 응답 성공 시 */
  (response: AxiosResponse) => {
    const { method, url } = response.config
    const { status, data } = response

    /* LOGGING */
    console.log(`🎁 [API] ${method?.toUpperCase()} ${url} | Response ${status}\n\n${JSON.stringify(data, null, 2)}\n`)

    return data
  },

  /* 응답 실패 시 */
  (error: AxiosError | Error) => {
    if (axios.isAxiosError(error)) {
      console.log('Axios Error: ', error)
      /* LOGGING */
      const { message } = error
      const { method, url } = error.config as AxiosRequestConfig

      console.log(`🚨 [API] ${method?.toUpperCase()} ${url} | Error ${message}`)
    }

    return Promise.reject(error)
  },
)

export default http
