import type { Metadata } from 'next'
import ReactQueryProvider from '@contexts/ReactQueryProvider'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'OpenRun Admin',
  description: 'OpenRun Admin Console',
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
      <body suppressHydrationWarning>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}
