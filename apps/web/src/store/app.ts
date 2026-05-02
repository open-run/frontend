import { create } from 'zustand'

export type Insets = {
  top: number
  bottom: number
}

type App = {
  isApp: boolean
  setIsApp: (isApp: boolean) => void
  insets: Insets | null
  setInsets: (insets: Insets) => void
}

export const useAppStore = create<App>()((set) => ({
  isApp: false,
  setIsApp: (isApp: boolean) => set(() => ({ isApp })),
  insets: null,
  setInsets: (insets: Insets) => set(() => ({ insets })),
}))
