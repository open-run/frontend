import type { Metadata } from 'next'
import { Jost } from 'next/font/google'
import { WalletProvider } from '@contexts/WalletProvider'
import ReactQueryProvider from '@contexts/ReactQueryProvider'
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
          <WalletProvider>{children}</WalletProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
