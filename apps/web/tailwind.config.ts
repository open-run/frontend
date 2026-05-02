import type { Config } from 'tailwindcss'
import preset from '@openrun/ui/tailwind.preset'

const config: Config = {
  presets: [preset],
  content: ['./src/**/*.{js,ts,jsx,tsx}', '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'],
}

export default config
