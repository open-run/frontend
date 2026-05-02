'server-only'

import { cookies } from 'next/headers'
import qs from 'qs'
import { COOKIE } from '@constants/cookie'

// ANSI 색상 코드
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

export const http = {
  get: async ({ url, params, options }: { url: string; params?: unknown; options?: RequestInit }) => {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(COOKIE.ACCESSTOKEN)?.value
    const query = qs.stringify(params)

    try {
      const requestUrl = `${url}?${query}`
      const headers: Record<string, string> = {}
      if (accessToken != null) {
        headers['Authorization'] = accessToken
      }

      // cURL 명령어 생성
      const curlCommand = [
        'curl',
        '-X GET',
        `'${requestUrl}'`,
        ...Object.entries(headers).map(([key, value]) => `-H '${key}: ${value}'`),
      ].join(' \\\n  ')

      console.info(
        `\n${colors.cyan}${colors.bright}[cURL] Request Command:${colors.reset}\n${colors.blue}${curlCommand}${colors.reset}\n`,
      )

      const response = await fetch(requestUrl, {
        headers: Object.keys(headers).length > 0 ? headers : undefined,
        ...options,
      })

      if (!response.ok) {
        const errorMessage = 'Failed to fetch'
        const errorDetails = {
          url: requestUrl,
          status: response.status,
          statusText: response.statusText,
        }
        console.error(
          `\n${colors.red}${colors.bright}[cURL] Error occurred with command:${colors.reset}\n${colors.yellow}${curlCommand}${colors.reset}`,
        )
        console.error(`${colors.red}${colors.bright}Error Details:${colors.reset}`)
        console.error(JSON.stringify(errorDetails, null, 2))
        console.error('')

        throw new Error(errorMessage, { cause: errorDetails })
      }

      const data = await response.json()
      console.info(
        `\n${colors.green}${colors.bright}[API Response]:${colors.reset} ${colors.cyan}${requestUrl}${colors.reset}`,
      )
      console.info(data, '\n')

      return data
    } catch (error) {
      throw new Error('Failed to parse JSON', { cause: error })
    }
  },
}
