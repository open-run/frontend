import clsx from 'clsx'
import { motion } from 'framer-motion'
import {
  CSSProperties,
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

export function Dimmed({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <section className='z-modal fixed bottom-0 left-0 right-0 top-0 bg-black-darkest/60' onClick={onClick}>
      <motion.section
        className='h-full w-full'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}>
        {children}
      </motion.section>
    </section>
  )
}

export type BottomSheetRef = {
  close: () => void
}

const TRANSITION_DURATION = 300
const CLOSE_THRESHOLD = 20
const SHEET_TRANSITION = `transform ${TRANSITION_DURATION}ms ease-in-out, height ${TRANSITION_DURATION}ms ease-in-out`

export const BottomSheet = forwardRef<
  BottomSheetRef,
  {
    children: ReactNode
    fullSize?: boolean
    className?: string
    style?: CSSProperties
    onClose?: () => void
  }
>(function BottomSheet({ children, fullSize, className, style, onClose }, ref) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef(0)
  const currentDeltaRef = useRef(0)
  const isClosingRef = useRef(false)
  const hasMountedRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onCloseRef = useRef(onClose)

  const openTransform = fullSize ? 'translateY(7%)' : 'translateY(0%)'

  useLayoutEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // Enter animation (run once on mount)
  useEffect(() => {
    if (hasMountedRef.current) return
    hasMountedRef.current = true

    const el = sheetRef.current
    if (!el) return

    el.style.transform = 'translateY(100%)'
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = SHEET_TRANSITION
        el.style.transform = fullSize ? 'translateY(7%)' : 'translateY(0%)'
      })
    })
  }, [fullSize])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const close = useCallback(() => {
    if (isClosingRef.current) return
    isClosingRef.current = true

    const el = sheetRef.current
    if (el) {
      el.style.transition = SHEET_TRANSITION
      el.style.transform = 'translateY(100%)'
    }

    timeoutRef.current = setTimeout(() => {
      onCloseRef.current?.()
    }, TRANSITION_DURATION)
  }, [])

  useImperativeHandle(ref, () => ({ close }), [close])

  // --- Drag handlers ---

  const handleDragStart = (clientY: number) => {
    if (!onClose || isClosingRef.current) return
    setIsDragging(true)
    startYRef.current = clientY
    currentDeltaRef.current = 0
  }

  const handleDragMove = (clientY: number) => {
    if (!isDragging || !sheetRef.current) return

    const delta = clientY - startYRef.current
    currentDeltaRef.current = Math.max(0, delta)

    sheetRef.current.style.transition = 'none'
    sheetRef.current.style.transform = `translateY(calc(${fullSize ? '7%' : '0%'} + ${currentDeltaRef.current}px))`
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    if (currentDeltaRef.current >= CLOSE_THRESHOLD) {
      close()
    } else {
      const el = sheetRef.current
      if (el) {
        el.style.transition = SHEET_TRANSITION
        el.style.transform = openTransform
      }
    }

    startYRef.current = 0
    currentDeltaRef.current = 0
  }

  const handleDragCancel = () => {
    if (!isDragging) return
    setIsDragging(false)

    const el = sheetRef.current
    if (el) {
      el.style.transition = SHEET_TRANSITION
      el.style.transform = openTransform
    }

    startYRef.current = 0
    currentDeltaRef.current = 0
  }

  return (
    <div
      ref={sheetRef}
      className={clsx(
        'fixed bottom-0 left-0 w-full rounded-t-2xl bg-gray-lighten shadow-lg',
        fullSize && 'h-full',
        isDragging && 'cursor-grabbing',
        className,
      )}
      style={style}
      onClick={(e) => e.stopPropagation()}
      onMouseMove={(e) => handleDragMove(e.clientY)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragCancel}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
      onTouchEnd={handleDragEnd}
      onTouchCancel={handleDragCancel}>
      {/* Drag Handle */}
      {onClose && (
        <div
          className={clsx(
            'flex items-center justify-center px-16 pt-8 pb-4',
            isDragging ? 'cursor-grabbing' : 'cursor-grab',
          )}
          onMouseDown={(e) => handleDragStart(e.clientY)}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}>
          <div className={clsx('h-4 w-32 rounded-full', isDragging ? 'bg-gray-darken' : 'bg-gray-darken/40')} />
        </div>
      )}
      {children}
    </div>
  )
})

export function Popup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ y: '-30%', x: '-50%' }}
      animate={{ y: '-50%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={clsx('fixed left-1/2 top-1/2 w-[calc(100%-32px)] max-w-[328px] rounded-16 bg-white', className)}
      onClick={(e) => e.stopPropagation()}>
      {children}
    </motion.div>
  )
}
