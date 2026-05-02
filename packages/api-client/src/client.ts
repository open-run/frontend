import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Cookies } from 'react-cookie'

export type { ApiResponse, Pagination, PaginationResponse } from './type'

const ACCESSTOKEN = 'ACCESSTOKEN'

const cookies = new Cookies()

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
})

http.interceptors.request.use(async (request) => {
  const { method, url, params } = request

  if (params != null) {
    request.params = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== null && value !== undefined),
    )
  }

  console.log(`🚀 [API] ${method?.toUpperCase()} ${url} | Request\n\n${JSON.stringify(request.params, null, 2)}\n`)

  let token
  if (typeof window === 'undefined') {
    const { cookies: nextCookies } = await import('next/headers')
    const cookieStore = await nextCookies()
    token = cookieStore.get(ACCESSTOKEN)?.value
  } else {
    token = cookies.get(ACCESSTOKEN)
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

    console.log(`🎁 [API] ${method?.toUpperCase()} ${url} | Response ${status}\n\n${JSON.stringify(data, null, 2)}\n`)

    return data
  },
  (error: AxiosError | Error) => {
    if (axios.isAxiosError(error)) {
      console.log('Axios Error: ', error)
      const { message } = error
      const { method, url } = error.config as AxiosRequestConfig
      console.log(`🚨 [API] ${method?.toUpperCase()} ${url} | Error ${message}`)
    }

    return Promise.reject(error)
  },
)

export default http
