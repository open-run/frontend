import { Metadata } from 'next'
import Explore from '@components/explore/Explore'

export default function Page() {
  return <Explore />
}

export const metadata: Metadata = {
  title: '탐색',
}
