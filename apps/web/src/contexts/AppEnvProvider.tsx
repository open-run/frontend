'use client'

import { ReactNode, createContext, useContext } from 'react'

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
