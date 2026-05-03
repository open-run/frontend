import type { Metadata } from 'next'
import { Jost } from 'next/font/google'
import { ModalProvider } from '@contexts/ModalProvider'
import ReactQueryProvider from '@contexts/ReactQueryProvider'
import { WalletProvider } from '@contexts/WalletProvider'
import { ROOT_PORTAL_ID } from '@constants/layout'
import '@/styles/globals.css'

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
})

export const metadata: Metadata = {
  title: 'OpenRun Admin',
  description: 'OpenRun Admin Console',
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
      <body suppressHydrationWarning className={jost.variable}>
        <ReactQueryProvider>
          <WalletProvider>
            <ModalProvider>{children}</ModalProvider>
          </WalletProvider>
        </ReactQueryProvider>
        <div id={ROOT_PORTAL_ID} />
      </body>
    </html>
  )
}
