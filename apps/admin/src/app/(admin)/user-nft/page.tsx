import type { Metadata } from 'next'
import AdminUserNftPanel from '@components/admin/user-nft/AdminUserNftPanel'

export const metadata: Metadata = {
  title: '유저 NFT · OpenRun Admin',
}

export default function Page() {
  return <AdminUserNftPanel />
}
