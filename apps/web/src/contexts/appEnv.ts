/**
 * 앱 판별 유틸 — 서버(layout)와 클라이언트 양쪽에서 호출되므로
 * 'use client' 모듈(AppEnvProvider)에 두면 안 된다. 클라이언트 모듈에서 export한 함수는
 * 서버 컴포넌트에서 import 시 호출 불가능한 클라이언트 참조가 되어 런타임 에러가 난다.
 */

/** 앱 웹뷰가 UA 끝에 붙이는 식별 토큰 (app/app/index.tsx의 applicationNameForUserAgent) */
export const APP_UA_TOKEN = 'OpenRunApp'

/** 앱 여부 판별의 유일한 지점 */
export function isAppUserAgent(userAgent: string | null | undefined) {
  return userAgent?.includes(APP_UA_TOKEN) ?? false
}
