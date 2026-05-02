import { Metadata } from 'next'
import Profile from '@components/profile/Profile'

export default function Page() {
  return <Profile />
}

export const metadata: Metadata = {
  title: '프로필',
}
