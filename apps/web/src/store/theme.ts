import { create } from 'zustand'

type Theme = {
  isDarkMode: boolean
  setIsDarkMode: () => void
}

export const useTheme = create<Theme>()((set) => ({
  isDarkMode: false,
  setIsDarkMode: () => set((state) => ({ isDarkMode: state.isDarkMode })),
}))
