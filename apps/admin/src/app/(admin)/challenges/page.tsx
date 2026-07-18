import type { Metadata } from 'next'
import AdminChallengeContentPanel from '@components/admin/AdminChallengeContentPanel'

export const metadata: Metadata = {
  title: '도전과제 · OpenRun Admin',
}

export default function Page() {
  return <AdminChallengeContentPanel />
}
