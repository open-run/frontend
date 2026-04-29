import Skeleton from '@shared/Skeleton'
import { TransparentOpenrunIcon } from '@icons/openrun'
import { colors } from '@styles/colors'

export default function AvatarPageSkeleton() {
  return (
    <article className='h-full w-full bg-white app:pt-50'>
      <header className='relative z-20 flex h-60 w-full items-center justify-center bg-white px-5'>
        <Skeleton className='absolute left-16 h-32 w-32 -translate-x-4 rounded-8 bg-gray' />
        <h1 className='text-16 font-bold text-black'>아바타 변경</h1>
        <Skeleton className='absolute right-16 h-28 w-42 translate-x-8 rounded-8 bg-gray' />
      </header>

      <section className='flex h-[calc(100%-60px)] w-full flex-col items-center bg-gray-lighten'>
        <section className='z-10 w-full bg-white px-16 shadow-floating-primary'>
          <div className='relative mb-16 flex h-248 w-full justify-center rounded-16 bg-black-darken'>
            <TransparentOpenrunIcon
              className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              size={160}
              color={colors.white}
            />
          </div>
        </section>

        <section className='flex w-full flex-col gap-16 pt-16'>
          <div className='flex w-full items-center gap-6 overflow-hidden px-16'>
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className='h-40 w-40 flex-shrink-0 rounded-4 bg-gray' />
            ))}
          </div>
        </section>

        <section className='h-full w-full overflow-hidden px-16 pb-30 pt-24'>
          <div className='grid grid-cols-3 gap-8'>
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className='relative flex w-full flex-col items-center gap-10 rounded-8 bg-white/40 p-12'>
                <Skeleton className='aspect-square w-full max-w-80 rounded-8 bg-gray' />
                <Skeleton className='h-14 w-full max-w-80 rounded-8 bg-gray' />
              </div>
            ))}
          </div>
        </section>
      </section>
    </article>
  )
}
