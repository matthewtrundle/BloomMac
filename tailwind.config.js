/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './layouts/**/*.{ts,tsx}',
  ],
  // Removed safelist pattern as it wasn't matching any actual classes
  theme: {
    extend: {
      colors: {
        bloompink: "#C6478A",
        bloom: {
          DEFAULT: '#2C3E50',
          accent: '#A3D8F4',
          blush: '#F4C2C2',
          grey: '#C8C0BB',
          darkGrey: '#7A6F6A',
          // Course slide colors
          sage: {
            DEFAULT: '#8B9A82',
            50: '#f5f7f4',
            100: '#e9ede5',
            200: '#d3dccc',
            300: '#b3c4a6',
            400: '#8B9A82',
            500: '#6B7A62',
            600: '#546149',
            700: '#454d3b',
            800: '#393f31',
            900: '#31352a',
            dark: '#6B7A62'
          },
          cream: '#F5F5DC',
          dark: '#4A4A4A',
          // Add more pink variants
          pink: {
            50: '#fdf2f4',
            100: '#fce7eb',
            200: '#fbd0d9',
            300: '#f9a8bd',
            400: '#f57a9f',
            500: '#ec5481',
            600: '#d93160',
            700: '#be2249',
            800: '#9e1d3e',
            900: '#851b36',
            light: '#f9a8bd',
            dark: '#be2249'
          },
          // Add soft gradients
          gradient: {
            pink: 'linear-gradient(135deg, #F4C2C2 0%, #fbd0d9 100%)',
            blue: 'linear-gradient(135deg, #A3D8F4 0%, #c8e7fa 100%)',
          }
        },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
      textShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.2)',
        DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.3)',
        lg: '0 4px 8px rgba(0, 0, 0, 0.4)',
      },
      boxShadow: {
        'pink-sm': '0 1px 2px 0 rgba(244, 194, 194, 0.05)',
        'pink-md': '0 4px 6px -1px rgba(244, 194, 194, 0.1), 0 2px 4px -1px rgba(244, 194, 194, 0.06)',
        'pink-lg': '0 10px 15px -3px rgba(244, 194, 194, 0.1), 0 4px 6px -2px rgba(244, 194, 194, 0.05)',
        'pink-xl': '0 20px 25px -5px rgba(244, 194, 194, 0.1), 0 10px 10px -5px rgba(244, 194, 194, 0.04)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'reveal-up': 'reveal-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.8s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.8s ease-out forwards',
        'gradient-text': 'gradient-text 3s ease-in-out infinite',
        'width': 'width 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.9 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'reveal-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-30px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(30px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'gradient-text': {
          '0%, 100%': { 
            backgroundSize: '200% 200%',
            backgroundPosition: 'left center',
            textShadow: '0 2px 4px rgba(198, 71, 138, 0.3)'
          },
          '50%': { 
            backgroundSize: '200% 200%',
            backgroundPosition: 'right center',
            textShadow: '0 2px 6px rgba(198, 71, 138, 0.4)'
          },
        },
        'width': {
          '0%': { width: '0', opacity: 0 },
          '100%': { width: '10rem', opacity: 1 },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('./tailwind-plugins/text-shadow.js')
  ],
}
