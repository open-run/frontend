export const colors = {
  primary: {
    DEFAULT: 'hsl(233, 84%, 61%)', // #4A5CEF
    darken: 'hsl(233, 84%, 51%)', // #2C3DC8
  },
  secondary: 'hsl(70, 95%, 68%)', // #E0FB60

  white: 'hsl(0, 0%, 100%)', // #fff
  black: {
    DEFAULT: 'hsl(0, 0%, 20%)', // #333
    darken: 'hsl(0, 0%, 13%)', // #222
    darkest: 'hsl(0, 0%, 0%)', // #000
  },
  gray: {
    lighten: 'hsl(210, 17%, 98%)', // #F8F9FA
    DEFAULT: 'hsl(210, 14%, 89%)', // #DEE2E6
    darken: 'hsl(210, 11%, 71%)', // #ADB5BD
    darker: 'hsl(210, 11%, 62%)', // #89939D
    darkest: 'hsl(210, 7%, 56%)', // #868E96
  },
  pink: 'hsl(339, 82%, 67%)', // #F06595
  fluorescent: 'hsl(70, 95%, 68%)', // #E0FB60
  red: 'hsl(0, 100%, 50%)', // #FF0000
} as const
