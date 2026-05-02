import type { Metadata, Viewport } from 'next'
import { Jost } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import GoogleMapContext from '@contexts/GoogleMapContext'
import { ModalProvider } from '@contexts/ModalProvider'
import ReactQueryProvider from '@contexts/ReactQueryProvider'
import { WalletProvider } from '@contexts/WalletProvider'
import AppBridge from '@shared/AppBridge'
import Layout from '@shared/Layout'
import MintListener from '@components/challenges/rewards/MintListener'
import { ROOT_PORTAL_ID } from '@constants/layout'
import '@styles/globals.css'

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
      <body suppressHydrationWarning className={`font-pretendard ${jost.variable} touch-none`}>
        <ReactQueryProvider>
          <WalletProvider>
            <GoogleMapContext>
              <NuqsAdapter>
                <AppBridge>
                  <ModalProvider>
                    <MintListener />
                    <Layout>{children}</Layout>
                  </ModalProvider>
                </AppBridge>
              </NuqsAdapter>
            </GoogleMapContext>
          </WalletProvider>
        </ReactQueryProvider>
        <div id={ROOT_PORTAL_ID} />
      </body>
    </html>
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
