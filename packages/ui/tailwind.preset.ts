import type { Config } from 'tailwindcss'
import { colors } from './src/styles/colors'

const createPxRange = (max: number) => Object.fromEntries(Array.from(Array(max + 1)).map((_, i) => [i, `${i}px`]))

const preset: Partial<Config> = {
  darkMode: 'class',
  theme: {
    screens: {
      xs: '360px',
      sm: '576px',
      md: '769px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1367px',
      '3xl': '1536px',
      '4xl': '1920px',
    },
    fontSize: {
      10: ['0.625rem', { lineHeight: '1.2', letterSpacing: '-0.013rem' }],
      12: ['0.75rem', { lineHeight: '1.333', letterSpacing: '-0.015rem' }],
      14: ['0.875rem', { lineHeight: '1.428', letterSpacing: '-0.018rem' }],
      16: ['1rem', { lineHeight: '1.5', letterSpacing: '-0.02rem' }],
      18: ['1.125rem', { lineHeight: '1.444', letterSpacing: '-0.023rem' }],
      20: ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.025rem' }],
      22: ['1.375rem', { lineHeight: '1.545', letterSpacing: '-0.035rem' }],
      28: ['1.75rem', { lineHeight: '1.285', letterSpacing: '-0.035rem' }],
      40: ['2.5rem', { lineHeight: '1.4', letterSpacing: '-0.05rem' }],
      56: ['3.5rem', { lineHeight: '1.142', letterSpacing: '-0.07rem' }],
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

      addVariant('app', '.app &')
      addVariant('group-active', ':merge(.group):active &')
    },
  ],
}

export default preset
