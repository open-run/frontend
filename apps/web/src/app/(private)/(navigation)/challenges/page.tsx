import { Metadata } from 'next'
import { CategoryType, ListType } from '@type/challenge'
import ListTab from '@components/challenges/ListTab'
import CompletedList from '@components/challenges/completed/CompletedList'
import CategoryTab from '@components/challenges/progress/CategoryTab'
import GeneralList from '@components/challenges/progress/general/GeneralList'
import RepetitiveList from '@components/challenges/progress/repetitive/RepetitiveList'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    list: ListType
    category?: CategoryType
  }>
}) {
  const { list, category } = await searchParams

  return (
    <section className='h-full w-full bg-gray-lighten'>
      <div className='h-full pt-32 app:pt-72'>
        <header className='mb-32 flex items-center justify-between px-24'>
          <h1 className='text-28 font-bold'>도전 과제</h1>
          <ListTab />
        </header>
        {list === 'progress' ? (
          <>
            <CategoryTab />
            {category === 'general' ? <GeneralList /> : <RepetitiveList />}
          </>
        ) : (
          <CompletedList />
        )}
      </div>
    </section>
  )
}

export const metadata: Metadata = {
  title: '도전 과제',
}
