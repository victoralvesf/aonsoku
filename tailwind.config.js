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
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        marquee: 'marquee var(--tw-marquee-time) linear 2s infinite',
      },
      gridTemplateColumns: {
        player:
          'minmax(250px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(250px, 1fr)',
        'table-fallback':
          'minmax(40px, 50px) minmax(0px, 3fr) minmax(0px, 2fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(60px, 70px) minmax(100px, 120px)',
        header:
          'minmax(180px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(180px, 1fr)',
      },
      flexBasis: {
        '1/8': '12.5%',
      },
      maskImage: {
        'marquee-fade':
          'linear-gradient(270deg, transparent 0%, rgb(0, 0, 0) 3%, rgb(0, 0, 0) 97%, transparent 100%)',
        'marquee-fade-finished':
          'linear-gradient(270deg, transparent 0%, rgb(0, 0, 0) 3%, rgb(0, 0, 0) 100%, transparent 100%)',
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
