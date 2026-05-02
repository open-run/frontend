import { Metadata } from 'next'
import MintJobNotifications from '@components/notifications/MintJobNotifications'

export default function Page() {
  return <MintJobNotifications />
}

export const metadata: Metadata = {
  title: '알림',
}
