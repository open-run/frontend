import { create } from 'zustand'
import type { AppStatusBarStyle } from '@constants/app'

export type Insets = {
  top: number
  bottom: number
}

type StatusBarOverride = {
  pathname: string
  style: AppStatusBarStyle
}

type App = {
  insets: Insets | null
  setInsets: (insets: Insets) => void
  previewInsets: Insets | null
  setPreviewInsets: (insets: Insets | null) => void
  statusBarOverride: StatusBarOverride | null
  setStatusBarOverride: (override: StatusBarOverride) => void
  clearStatusBarOverride: (pathname: string) => void
}

export const useAppStore = create<App>()((set) => ({
  insets: null,
  setInsets: (insets: Insets) => set(() => ({ insets })),
  previewInsets: null,
  setPreviewInsets: (insets: Insets | null) => set(() => ({ previewInsets: insets })),
  statusBarOverride: null,
  setStatusBarOverride: (override: StatusBarOverride) => set(() => ({ statusBarOverride: override })),
  clearStatusBarOverride: (pathname: string) =>
    set((state) => (state.statusBarOverride?.pathname === pathname ? { statusBarOverride: null } : {})),
}))
