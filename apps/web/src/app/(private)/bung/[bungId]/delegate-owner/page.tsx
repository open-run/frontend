import { Metadata } from 'next'
import DelegateOwner from '@components/bung/DelegateOwner'

export default async function Page({ searchParams }: { searchParams: Promise<{ memberList: string }> }) {
  const params = await searchParams
  const memberList = JSON.parse(params.memberList)
  return <DelegateOwner memberList={memberList} />
}

export const metadata: Metadata = {
  title: '벙주 넘기기',
}
