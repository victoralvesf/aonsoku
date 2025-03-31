/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      spacing: {
        header: 'var(--header-height)',
        sidebar: 'var(--sidebar-width)',
        'mini-sidebar': 'var(--mini-sidebar-width)',
        player: 'var(--player-height)',
        content: 'var(--content-height)',
        'shadow-header': 'var(--shadow-header-height)',
        'shadow-header-distance': 'var(--shadow-header-distance)',
        toast: 'var(--toastify-toast-container-height)',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: {
          DEFAULT: 'hsl(var(--background))',
          foreground: 'hsl(var(--background-foreground))',
        },
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'windows-red': 'hsl(var(--windows-red))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        marquee: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '5%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(var(--tw-translate-x-end), 0, 0)' },
          '55%': { transform: 'translate3d(var(--tw-translate-x-end), 0, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' },
        },
        'slide-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'slide-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        marquee: 'marquee var(--tw-marquee-time) linear 2s infinite',
        'slide-down': 'slide-down 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      gridTemplateColumns: {
        player:
          'minmax(250px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(250px, 1fr)',
        'table-fallback':
          'minmax(40px, 50px) minmax(0px, 3fr) minmax(0px, 2fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(60px, 70px) minmax(100px, 120px)',
        header:
          'minmax(180px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(180px, 1fr)',
        'mid-player-info': 'minmax(40px, 70px) minmax(168px, 1fr)',
        'mini-player': 'minmax(30px, 40px) minmax(80px, 1fr) 64px',
      },
      gridTemplateRows: {
        'floating-player': 'minmax(0, 1fr) 40px',
      },
      flexBasis: {
        '1/8': '12.5%',
      },
      maskImage: {
        'marquee-fade':
          'linear-gradient(270deg, transparent 0%, rgb(0, 0, 0) 3%, rgb(0, 0, 0) 97%, transparent 100%)',
        'marquee-fade-finished':
          'linear-gradient(270deg, transparent 0%, rgb(0, 0, 0) 3%, rgb(0, 0, 0) 100%, transparent 100%)',
        'carousel-item': 'radial-gradient(circle, white 100%, transparent 0)',
        'big-player-lyrics':
          'linear-gradient(180deg, transparent 0%, rgb(0, 0, 0) 25%, rgb(0, 0, 0) 75%, transparent 100%)',
        lyrics:
          'linear-gradient(180deg, transparent 0%, rgb(0, 0, 0) 10%, rgb(0, 0, 0) 90%, transparent 100%)',
      },
      boxShadow: {
        'custom-3': '0 0 3px rgba(255, 255, 255, 0.03)',
        'custom-5': '0 0 5px rgba(255, 255, 255, 0.05)',
        'header-image': '0 4px 35px rgba(0, 0, 0, 0.6)',
      },
      screens: {
        'mid-player': { raw: '(min-height: 133px) and (max-height: 170px)' },
        'mini-player': { raw: '(max-height: 132px)' },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwind-extended-shadows'),
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          maskImage: (value) => {
            return {
              maskImage: value,
            }
          },
        },
        {
          values: theme('maskImage'),
        },
      )
    },
  ],
}
