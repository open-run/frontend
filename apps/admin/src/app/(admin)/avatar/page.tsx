import type { Metadata } from 'next'
import AdminAvatarTryOnPanel from '@components/admin/avatar-try-on/AdminAvatarTryOnPanel'

export const metadata: Metadata = {
  title: '아바타 · OpenRun Admin',
}

export default function Page() {
  return <AdminAvatarTryOnPanel />
}
