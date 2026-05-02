import { Metadata } from 'next'
import ManageMembers from '@components/bung/ManageMembers'

export default async function Page({ searchParams }: { searchParams: Promise<{ memberList: string }> }) {
  const params = await searchParams
  const memberList = JSON.parse(params.memberList)
  return <ManageMembers memberList={memberList} />
}

export const metadata: Metadata = {
  title: '멤버 관리',
}
