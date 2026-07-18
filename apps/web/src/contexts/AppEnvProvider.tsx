'use client'

import { ReactNode, createContext, useContext } from 'react'

/** 앱 웹뷰가 UA 끝에 붙이는 식별 토큰 (app/app/index.tsx의 applicationNameForUserAgent) */
export const APP_UA_TOKEN = 'OpenRunApp'

/** 앱 여부 판별의 유일한 지점 — 서버(layout)와 클라이언트 모두 이 함수만 사용한다 */
export function isAppUserAgent(userAgent: string | null | undefined) {
  return userAgent?.includes(APP_UA_TOKEN) ?? false
}

type AppEnv = {
  isApp: boolean
}

const AppEnvContext = createContext<AppEnv>({ isApp: false })

/**
 * 서버 layout이 요청 헤더의 UA로 판별한 값을 그대로 내려받는다.
 * 서버 렌더와 클라이언트 hydration이 항상 같은 값을 보므로 불일치가 없다.
 */
export function AppEnvProvider({ isApp, children }: { isApp: boolean; children: ReactNode }) {
  return <AppEnvContext.Provider value={{ isApp }}>{children}</AppEnvContext.Provider>
}

export function useAppEnv() {
  return useContext(AppEnvContext)
}
