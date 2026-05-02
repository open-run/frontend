import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

export interface UseChainScrollOptions {
  totalItems: number
  itemHeight: number
  wrap: boolean
  initialIndex: number
  onChange: (index: number) => void
}

export interface UseChainScrollReturn {
  scrollY: number
  centerIndex: number
  subPixelOffset: number
  containerRef: React.RefObject<HTMLDivElement>
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void
    onMouseMove: (e: React.MouseEvent) => void
    onMouseUp: () => void
    onMouseLeave: () => void
    onTouchStart: (e: React.TouchEvent) => void
    onTouchEnd: () => void
    onTouchCancel: () => void
    onWheel: (e: React.WheelEvent) => void
  }
  syncToIndex: (index: number) => void
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

const BASE_ITEM_HEIGHT = 64

const BASE_PHYSICS = Object.freeze({
  FRICTION: 0.95,
  SNAP_FORCE: 0.2,
  MIN_VELOCITY: 0.01,
})

export function useChainScroll({
  totalItems,
  itemHeight,
  wrap,
  initialIndex,
  onChange,
}: UseChainScrollOptions): UseChainScrollReturn {
  const scale = itemHeight / BASE_ITEM_HEIGHT

  const physics = useMemo(
    () => ({
      ...BASE_PHYSICS,
      MAX_VELOCITY: 1.62 * scale,
      NEAR_ZERO_VELOCITY: 0.2 * scale,
      SNAP_VELOCITY_THRESHOLD: 0.04 * scale,
      BOUNDARY_PX: 4 * scale,
    }),
    [scale],
  )

  const scrollYRef = useRef(initialIndex * itemHeight)
  const [scrollY, setScrollY] = useState(scrollYRef.current)

  const isDraggingRef = useRef(false)
  const isAnimatingRef = useRef(false)
  const dragStartYRef = useRef(0)
  const dragStartScrollRef = useRef(0)
  const velocitySamplesRef = useRef<Array<{ time: number; y: number }>>([])
  const rafIdRef = useRef<number | null>(null)
  const onChangeRef = useRef(onChange)
  const containerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>

  useLayoutEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const cancelAnimation = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
  }, [])

  const updateScrollY = useCallback((val: number) => {
    scrollYRef.current = val
    setScrollY(val)
  }, [])

  const normalizeScrollY = useCallback(
    (val: number): number => {
      if (!wrap) return Math.max(0, Math.min(val, (totalItems - 1) * itemHeight))
      const total = totalItems * itemHeight
      return ((val % total) + total) % total
    },
    [wrap, totalItems, itemHeight],
  )

  const calculateVelocity = useCallback((): number => {
    const samples = velocitySamplesRef.current
    if (samples.length < 2) return 0
    const first = samples[0]
    const last = samples[samples.length - 1]
    const dt = last.time - first.time
    if (dt === 0) return 0
    const v = (last.y - first.y) / dt
    return Math.max(-physics.MAX_VELOCITY, Math.min(physics.MAX_VELOCITY, v))
  }, [physics.MAX_VELOCITY])

  const snapToClosestItem = useCallback(
    (fromPosition: number) => {
      cancelAnimation()

      let nearestIndex: number
      if (wrap) {
        nearestIndex = Math.round(fromPosition / itemHeight)
      } else {
        nearestIndex = Math.max(
          0,
          Math.min(Math.round(fromPosition / itemHeight), totalItems - 1),
        )
      }
      const targetPosition = nearestIndex * itemHeight

      const animateSnap = (current: number) => {
        if (Math.abs(current - targetPosition) < 0.5) {
          const finalPos = normalizeScrollY(targetPosition)
          updateScrollY(finalPos)
          isAnimatingRef.current = false
          const finalIndex = wrap
            ? mod(Math.round(finalPos / itemHeight), totalItems)
            : Math.round(finalPos / itemHeight)
          onChangeRef.current(finalIndex)
        } else {
          const next = current + (targetPosition - current) * physics.SNAP_FORCE
          updateScrollY(next)
          rafIdRef.current = requestAnimationFrame(() => animateSnap(next))
        }
      }

      rafIdRef.current = requestAnimationFrame(() => animateSnap(fromPosition))
    },
    [cancelAnimation, wrap, totalItems, itemHeight, normalizeScrollY, updateScrollY, physics.SNAP_FORCE],
  )

  const applyMomentum = useCallback(
    (initialVelocity: number) => {
      cancelAnimation()
      isAnimatingRef.current = true

      let velocity = -initialVelocity
      let pos = scrollYRef.current
      let lastTime = performance.now()

      const animate = (now: number) => {
        const dt = now - lastTime
        lastTime = now

        pos += velocity * dt

        if (!wrap) {
          const maxPos = (totalItems - 1) * itemHeight
          if (pos < 0) {
            pos = 0
            velocity = 0
          } else if (pos > maxPos) {
            pos = maxPos
            velocity = 0
          }
        }

        velocity *= physics.FRICTION
        updateScrollY(pos)

        const nearestTarget = Math.round(pos / itemHeight) * itemHeight
        const dist = Math.abs(pos - nearestTarget)
        const slowEnough = Math.abs(velocity) <= physics.SNAP_VELOCITY_THRESHOLD
        const nearZero = Math.abs(velocity) <= physics.NEAR_ZERO_VELOCITY
        const nearBoundary = dist <= physics.BOUNDARY_PX

        if ((nearZero && nearBoundary) || slowEnough) {
          snapToClosestItem(pos)
        } else {
          rafIdRef.current = requestAnimationFrame(animate)
        }
      }

      rafIdRef.current = requestAnimationFrame(animate)
    },
    [cancelAnimation, wrap, totalItems, itemHeight, updateScrollY, snapToClosestItem, physics],
  )

  // --- Internal handlers ---

  const handleStart = useCallback(
    (clientY: number) => {
      cancelAnimation()
      isDraggingRef.current = true
      isAnimatingRef.current = false
      dragStartYRef.current = clientY
      dragStartScrollRef.current = scrollYRef.current
      velocitySamplesRef.current = [{ time: performance.now(), y: clientY }]
    },
    [cancelAnimation],
  )

  const handleMoveInternal = useCallback(
    (clientY: number) => {
      if (!isDraggingRef.current || isAnimatingRef.current) return

      const distance = dragStartYRef.current - clientY
      let newScrollY = dragStartScrollRef.current + distance

      if (!wrap) {
        newScrollY = Math.max(0, Math.min(newScrollY, (totalItems - 1) * itemHeight))
      }

      updateScrollY(newScrollY)

      const now = performance.now()
      velocitySamplesRef.current = [
        ...velocitySamplesRef.current.filter((s) => now - s.time <= 100),
        { time: now, y: clientY },
      ]
    },
    [wrap, totalItems, itemHeight, updateScrollY],
  )

  const handleEnd = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false

    const velocity = calculateVelocity()

    if (Math.abs(velocity) < physics.MIN_VELOCITY) {
      snapToClosestItem(scrollYRef.current)
      return
    }

    applyMomentum(velocity)
  }, [calculateVelocity, snapToClosestItem, applyMomentum, physics.MIN_VELOCITY])

  // --- Exposed event handlers ---

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleStart(e.clientY)
    },
    [handleStart],
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleMoveInternal(e.clientY)
    },
    [handleMoveInternal],
  )

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleStart(e.touches[0].clientY)
    },
    [handleStart],
  )

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const direction = e.deltaY > 0 ? 1 : -1
      const currentIndex = Math.round(scrollYRef.current / itemHeight)
      let newScrollY = (currentIndex + direction) * itemHeight

      if (!wrap) {
        newScrollY = Math.max(0, Math.min(newScrollY, (totalItems - 1) * itemHeight))
      }

      cancelAnimation()
      isAnimatingRef.current = true
      scrollYRef.current = newScrollY
      snapToClosestItem(newScrollY)
    },
    [wrap, totalItems, itemHeight, cancelAnimation, snapToClosestItem],
  )

  // --- passive: false touchmove ---

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleMoveInternal(e.touches[0].clientY)
    }

    el.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', onTouchMove)
  }, [handleMoveInternal])

  // --- Cleanup on unmount ---

  useLayoutEffect(() => {
    return () => cancelAnimation()
  }, [cancelAnimation])

  // --- External value sync ---

  const syncToIndex = useCallback(
    (index: number) => {
      if (isDraggingRef.current || isAnimatingRef.current) return
      const newScrollY = index * itemHeight
      scrollYRef.current = newScrollY
      setScrollY(newScrollY)
    },
    [itemHeight],
  )

  // --- Derived values ---

  const centerFloat = scrollY / itemHeight
  const centerIndex = Math.round(centerFloat)
  const subPixelOffset = (centerFloat - centerIndex) * itemHeight

  return {
    scrollY,
    centerIndex,
    subPixelOffset,
    containerRef,
    handlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp: handleEnd,
      onMouseLeave: handleEnd,
      onTouchStart,
      onTouchEnd: handleEnd,
      onTouchCancel: handleEnd,
      onWheel,
    },
    syncToIndex,
  }
}
