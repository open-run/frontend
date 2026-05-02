import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios'

export type { ApiResponse, Pagination, PaginationResponse } from './type'

export const COOKIE = {
  ACCESSTOKEN: 'ACCESSTOKEN',
} as const

const isDev = process.env.NODE_ENV !== 'production'
const log: (...args: unknown[]) => void = isDev ? console.log.bind(console) : () => {}

function readBrowserCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))
  if (!match) return undefined
  const value = match.slice(name.length + 1)
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

type ApiClientConfig = {
  baseURL?: string
  cookieName?: string
}

export function createApiClient({ baseURL, cookieName = COOKIE.ACCESSTOKEN }: ApiClientConfig = {}) {
  const http = axios.create({ baseURL })

  http.interceptors.request.use(async (request) => {
    const { method, url, params } = request

    if (params != null) {
      request.params = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== null && value !== undefined),
      )
    }

    log(`🚀 [API] ${method?.toUpperCase()} ${url} | Request\n\n${JSON.stringify(request.params, null, 2)}\n`)

    let token: string | undefined
    if (typeof window === 'undefined') {
      try {
        const { cookies: nextCookies } = await import('next/headers')
        const cookieStore = await nextCookies()
        token = cookieStore.get(cookieName)?.value
      } catch {
        token = undefined
      }
    } else {
      token = readBrowserCookie(cookieName)
    }

    if (token != null) {
      request.headers = new AxiosHeaders()
      request.headers['Authorization'] = token
    }

    return request
  })

  http.interceptors.response.use(
    (response: AxiosResponse) => {
      const { method, url } = response.config
      const { status, data } = response

      log(`🎁 [API] ${method?.toUpperCase()} ${url} | Response ${status}\n\n${JSON.stringify(data, null, 2)}\n`)

      return data
    },
    (error: AxiosError | Error) => {
      if (axios.isAxiosError(error)) {
        log('Axios Error: ', error)
        const { message } = error
        const { method, url } = error.config as AxiosRequestConfig
        log(`🚨 [API] ${method?.toUpperCase()} ${url} | Error ${message}`)
      }

      return Promise.reject(error)
    },
  )

  return http
}

const defaultClient = createApiClient({ baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL })
export default defaultClient
