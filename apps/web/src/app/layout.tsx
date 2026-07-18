import clsx from 'clsx'
import type { Metadata, Viewport } from 'next'
import { Jost } from 'next/font/google'
import { headers } from 'next/headers'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { AppEnvProvider } from '@contexts/AppEnvProvider'
import { isAppUserAgent } from '@contexts/appEnv'
import GoogleMapContext from '@contexts/GoogleMapContext'
import { ModalProvider } from '@contexts/ModalProvider'
import ReactQueryProvider from '@contexts/ReactQueryProvider'
import { WalletProvider } from '@contexts/WalletProvider'
import AppBridge from '@shared/AppBridge'
import Layout from '@shared/Layout'
import OverlayScrollbarManager from '@shared/OverlayScrollbarManager'
import RouteViewTransitions from '@shared/RouteViewTransitions'
import '@styles/globals.css'

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // 앱 여부는 요청 UA로 서버에서 한 번만 판별한다 — 첫 HTML부터 app 스타일이 적용되고,
  // 클라이언트는 AppEnvProvider로 같은 값을 물려받아 hydration 불일치가 없다
  const isApp = isAppUserAgent((await headers()).get('user-agent'))

  return (
    <RouteViewTransitions>
      <html lang='ko'>
        <body suppressHydrationWarning className={clsx('font-pretendard', jost.variable, 'touch-none', isApp && 'app')}>
          <AppEnvProvider isApp={isApp}>
            <ReactQueryProvider>
              <WalletProvider>
                <GoogleMapContext>
                  <NuqsAdapter>
                    <AppBridge>
                      <ModalProvider>
                        <Layout>{children}</Layout>
                        <OverlayScrollbarManager />
                      </ModalProvider>
                    </AppBridge>
                  </NuqsAdapter>
                </GoogleMapContext>
              </WalletProvider>
            </ReactQueryProvider>
          </AppEnvProvider>
        </body>
      </html>
    </RouteViewTransitions>
  )
}

export const metadata: Metadata = {
  title: {
    template: '%s | OpenRun',
    default: 'OpenRun',
  },
  description: "OpenRun, Let's run together!",
  other: {
    /* Allow web app to be run in full-screen mode - iOS. */
    'apple-mobile-web-app-capable': 'yes',
    /* Allow web app to be run in full-screen mode - Android. */
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  userScalable: false,
  initialScale: 1,
  maximumScale: 1,
}
