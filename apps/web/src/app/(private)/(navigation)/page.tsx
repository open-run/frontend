'use client'

import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useRef, useState } from 'react'
import ChallengeSwiper from '@components/home/ChallengeSwiper'
import Header from '@components/home/Header'
import Recommendation from '@components/home/Recommendation'
import ScheduledBungs from '@components/home/ScheduledBungs'
import Spacing from '@shared/Spacing'
import { useAppStore } from '@store/app'

export default function Page() {
  const [isSmallHeaderActive, setIsSmallHeaderActive] = useState(false)
  const { isApp, insets } = useAppStore()

  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({
    container: scrollRef,
  })
  const appTopPadding = insets ? insets.top + 5 : isApp ? 64 : 0
  const contentPaddingTop = 200 + appTopPadding

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsSmallHeaderActive((prev) => {
      if (prev) {
        return latest > 24
      }

      return latest >= 72
    })
  })

  return (
    <div className='relative h-full bg-gray-lighten'>
      <Header isSmallHeaderActive={isSmallHeaderActive} />
      <section ref={scrollRef} className='h-full overflow-y-auto pb-96' style={{ paddingTop: contentPaddingTop }}>
        {/* <ChallengeSwiper /> */}
        <Spacing size={8} />
        <ScheduledBungs />
        <Spacing size={40} />
        <Recommendation />
      </section>
    </div>
  )
}
