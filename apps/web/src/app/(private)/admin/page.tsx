import { Metadata } from 'next'
import AdminPage from '@components/admin/AdminPage'

export default function Page() {
  return <AdminPage />
}

export const metadata: Metadata = {
  title: '어드민',
}
