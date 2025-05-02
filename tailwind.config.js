/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './layouts/**/*.{ts,tsx}',
  ],
  safelist: [
    {
      pattern: /(bg|text|border)-(bloom|accent|blush)-(100|200|300|400|500|600|700)/,
      variants: ['hover', 'focus'],
    },
  ],
  theme: {
    extend: {
      colors: {
        bloom: {
          DEFAULT: '#2C3E50',
          accent: '#A3D8F4',
          blush: '#F4C2C2',
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
      },
      boxShadow: {
        'pink-sm': '0 1px 2px 0 rgba(244, 194, 194, 0.05)',
        'pink-md': '0 4px 6px -1px rgba(244, 194, 194, 0.1), 0 2px 4px -1px rgba(244, 194, 194, 0.06)',
        'pink-lg': '0 10px 15px -3px rgba(244, 194, 194, 0.1), 0 4px 6px -2px rgba(244, 194, 194, 0.05)',
        'pink-xl': '0 20px 25px -5px rgba(244, 194, 194, 0.1), 0 10px 10px -5px rgba(244, 194, 194, 0.04)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
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
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
