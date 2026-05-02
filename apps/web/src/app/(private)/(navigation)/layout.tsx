import { ReactNode } from 'react'
import BottomNavigation from '@shared/BottomNavigation'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <BottomNavigation />
    </>
  )
}
