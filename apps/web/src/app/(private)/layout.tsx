import { ReactNode } from 'react'
import AuthGuard from '@shared/AuthGuard'

export default function Layout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>
}
