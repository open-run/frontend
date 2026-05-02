import type { Config } from 'tailwindcss'
import { colors } from './src/styles/colors'

const createPxRange = (max: number) => Object.fromEntries(Array.from(Array(max + 1)).map((_, i) => [i, `${i}px`]))

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '360px', // min-w-[360px]
      sm: '576px',
      md: '769px', // Tablet 769px - 1366px (max-w-[768px] 고정에 중앙정렬로 여백만 확대)
      lg: '1024px',
      xl: '1280px',
      '2xl': '1367px', // Desktop 시작 1367px
      '3xl': '1536px',
      '4xl': '1920px',
    },
    fontSize: {
      10: ['0.625rem', { lineHeight: '1.2', letterSpacing: '-0.013rem' }], // [10px, 12px, -0.2px]
      12: ['0.75rem', { lineHeight: '1.333', letterSpacing: '-0.015rem' }], // [12px, 16px, -0.24px]
      14: ['0.875rem', { lineHeight: '1.428', letterSpacing: '-0.018rem' }], // [14px, 20px, -0.28px]
      16: ['1rem', { lineHeight: '1.5', letterSpacing: '-0.02rem' }], // [16px, 24px, -0.32px]
      18: ['1.125rem', { lineHeight: '1.444', letterSpacing: '-0.023rem' }], // [18px, 26px, -0.36px]
      20: ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.025rem' }], // [20px, 30px, -0.4px]
      22: ['1.375rem', { lineHeight: '1.545', letterSpacing: '-0.035rem' }], // [22px, 36px, -0.56px]
      28: ['1.75rem', { lineHeight: '1.285', letterSpacing: '-0.035rem' }], // [28px, 36px, -0.56px]
      40: ['2.5rem', { lineHeight: '1.4', letterSpacing: '-0.05rem' }], // [40px, 56px, -0.8px]
      56: ['3.5rem', { lineHeight: '1.142', letterSpacing: '-0.07rem' }], // [56px, 64px, -1.12px]
    },
    colors: ({ colors: defaults }) => ({
      inherit: defaults.inherit,
      current: defaults.current,
      transparent: defaults.transparent,
      ...colors,
    }),
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
        jost: ['var(--font-jost)'],
      },
      spacing: createPxRange(200),
      width: createPxRange(500),
      height: createPxRange(500),
      borderWidth: createPxRange(10),
      borderRadius: createPxRange(50),
      maxWidth: {
        tablet: '768px',
      },
      backgroundImage: {
        'gradient-primary-white': 'linear-gradient(to bottom, #4A5CEF 50%, #FFF)',
        'gradient-white-secondary-primary':
          'linear-gradient(146deg, rgba(255, 255, 255, 0.20) 41.23%, rgba(224, 251, 96, 0.20) 65.21%, rgba(74, 92, 239, 0.20) 81.2%)',
        'gradient-transparent-secondary':
          'linear-gradient(90deg, rgba(0, 0, 0, 0.00) 0%, rgba(224, 251, 96, 0.80) 100%)',
        'gradient-bottom-navigation': 'linear-gradient(180deg, rgba(222, 226, 230, 0.00) 0%, #DEE2E6 70%)',
        'gradient-weather':
          'linear-gradient(180deg, #586587 0%, rgba(248, 249, 250, 0.00) 75%, rgba(248, 249, 250, 0.00) 100%)',
        'gradient-achievement-gift':
          'linear-gradient(180deg, rgba(74, 92, 239, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%)',
        'gradient-achievement-gray':
          'linear-gradient(180deg, rgba(88, 101, 135, 0.2) 0%, rgba(222, 226, 230, 0.2) 100%)',
      },
      boxShadow: {
        'floating-primary': '0px 0px 16px 0px rgba(74, 92, 239, 0.20)',
      },
      zIndex: {
        modal: '1000',
      },
      scale: {
        98: '0.98',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        marquee: 'marquee 7s linear infinite',
      },
    },
  },
  plugins: [
    function ({ addUtilities, addVariant }: { addUtilities: Function; addVariant: Function }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.active-press-duration': {
          transition: 'all 150ms ease-in-out',
        },
      })

      // app: variant 추가 - 앱 환경일 때 적용
      addVariant('app', '.app &')

      // group-active: variant 추가 - group 요소가 active 상태일 때 하위 요소에 적용
      addVariant('group-active', ':merge(.group):active &')
    },
  ],
}

export default config
