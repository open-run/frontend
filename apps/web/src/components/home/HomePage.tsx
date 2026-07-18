'use client'

import { useEffect } from 'react'
import Header from '@components/home/Header'
import Recommendation from '@components/home/Recommendation'
import ScheduledBungs from '@components/home/ScheduledBungs'
import Spacing from '@shared/Spacing'
import useElementScrollRestoration from '@hooks/useElementScrollRestoration'
import useAppInsetSize from '@hooks/useAppInsetSize'
import { HOME_SCROLL_TO_TOP_EVENT } from '@constants/navigationRoutes'

const HOME_SCROLL_RESTORATION_KEY = 'openrun:home-scroll-top'

export default function HomePage() {
  const appTopPadding = useAppInsetSize('top', 0)
  const contentPaddingTop = 200 + appTopPadding
  const { ref: scrollRef, onScroll: handleHomeScroll } = useElementScrollRestoration<HTMLElement>({
    storageKey: HOME_SCROLL_RESTORATION_KEY,
  })

  useEffect(() => {
    const handleHomeScrollToTop = () => {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener(HOME_SCROLL_TO_TOP_EVENT, handleHomeScrollToTop)
    return () => window.removeEventListener(HOME_SCROLL_TO_TOP_EVENT, handleHomeScrollToTop)
  }, [scrollRef])

  return (
    <div className='relative h-full bg-gray-lighten'>
      <Header />
      <section
        ref={scrollRef}
        className='scrollbar-web-hidden h-full overflow-y-auto pb-96'
        style={{ paddingTop: contentPaddingTop }}
        onScroll={handleHomeScroll}
      >
        <Spacing size={8} />
        <ScheduledBungs />
        <Spacing size={40} />
        <Recommendation />
      </section>
    </div>
  )
}
