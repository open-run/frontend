import type { Config } from 'tailwindcss'
import webConfig from '../web/tailwind.config'

const config: Config = {
  ...webConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
}

export default config
