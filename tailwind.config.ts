import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#6C63FF',
        'brand-dim': '#4E46D4',
        surface: {
          0: '#0A0A0F',
          1: '#111118',
          2: '#18181F',
          3: '#22222C',
          4: '#2C2C38',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          hover: 'rgba(255,255,255,0.12)',
          active: 'rgba(108,99,255,0.5)',
        },
        txt: {
          primary: '#F0EFF8',
          secondary: '#9897A8',
          muted: '#5C5C6E',
        },
        live: '#22C55E',
        warn: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '10px',
        xl: '14px',
        '2xl': '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease forwards',
        'slide-in': 'slideIn 0.2s ease forwards',
        'pulse-live': 'pulse-live 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease forwards',
      },
    },
  },
  plugins: [],
}

export default config
