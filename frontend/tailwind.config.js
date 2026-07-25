/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf7ee',
          100: '#f6ecd4',
          200: '#ecd79f',
          300: '#e0bd63',
          400: '#d6a73c',
          500: '#c4902a',
          600: '#a87223',
          700: '#845822',
          800: '#6b4823',
          900: '#5b3e23',
          950: '#342012',
        },
        cream: {
          50: '#fdfcf9',
          100: '#faf6ee',
          200: '#f3e9d6',
          300: '#e9d6b5',
          400: '#dcbe8c',
          500: '#cda86b',
          600: '#bf9250',
          700: '#a07842',
          800: '#7e5f39',
          900: '#5c4629',
        },
        beige: {
          50: '#faf8f4',
          100: '#f3eee3',
          200: '#e6dcc6',
          300: '#d4c39e',
          400: '#c2a877',
          500: '#b2925e',
          600: '#9d7c4f',
          700: '#7f6240',
          800: '#5d4930',
          900: '#3f3220',
        },
        brown: {
          50: '#faf7f4',
          100: '#f2ebe2',
          200: '#e4d3c2',
          300: '#d1b297',
          400: '#bb8e6c',
          500: '#a8724f',
          600: '#965e42',
          700: '#7c4a38',
          800: '#5f3a2d',
          900: '#4a2e24',
          950: '#2b1a13',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        widest: '0.25em',
      },
      maxWidth: {
        content: '1280px',
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(74, 46, 36, 0.12)',
        card: '0 12px 40px -12px rgba(74, 46, 36, 0.18)',
        luxury: '0 24px 60px -20px rgba(74, 46, 36, 0.28)',
        gold: '0 8px 30px -8px rgba(196, 144, 42, 0.35)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d6a73c 0%, #a87223 100%)',
        'cream-gradient': 'linear-gradient(180deg, #fdfcf9 0%, #faf6ee 100%)',
        'hero-overlay': 'linear-gradient(180deg, rgba(47,29,21,0.55) 0%, rgba(47,29,21,0.25) 50%, rgba(47,29,21,0.65) 100%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'slow-zoom': 'slow-zoom 12s ease-in-out infinite alternate',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
