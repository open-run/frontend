'use client'

import { useAppEnv } from '@contexts/AppEnvProvider'
import { type Insets, useAppStore } from '@store/app'

export type AppInsetEdge = keyof Insets

export function getAppInsetSize({
  base,
  edge,
  insets,
  isApp,
  previewInsets,
}: {
  base: number
  edge: AppInsetEdge
  insets: Insets | null
  isApp: boolean
  previewInsets?: Insets | null
}) {
  const effectiveInsets = isApp ? insets : previewInsets
  return base + (effectiveInsets?.[edge] ?? 0)
}

export function getAppInsetValue({
  edge,
  insets,
  isApp,
  previewInsets,
}: {
  edge: AppInsetEdge
  insets: Insets | null
  isApp: boolean
  previewInsets?: Insets | null
}) {
  const effectiveInsets = isApp ? insets : previewInsets
  return effectiveInsets?.[edge] ?? 0
}

export function useAppInsetValue(edge: AppInsetEdge) {
  const { isApp } = useAppEnv()
  const { insets, previewInsets } = useAppStore()

  return getAppInsetValue({ edge, insets, isApp, previewInsets })
}

export default function useAppInsetSize(edge: AppInsetEdge, base: number) {
  const { isApp } = useAppEnv()
  const { insets, previewInsets } = useAppStore()

  return getAppInsetSize({ base, edge, insets, isApp, previewInsets })
}
