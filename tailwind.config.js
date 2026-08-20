/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5', // Deep Indigo Primary
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'floating': '0 12px 30px -4px rgba(79, 70, 229, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'modal': '0 20px 45px -10px rgba(15, 23, 42, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
      },
      keyframes: {
        'modal-pop': {
          '0%': { opacity: '0', transform: 'scale(0.94) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'toast-slide': {
          '0%': { opacity: '0', transform: 'translateY(-16px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'modal-pop': 'modal-pop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'toast-slide': 'toast-slide 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.2s ease-out forwards',
        'fade-up': 'fade-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulse-subtle 2.5s infinite ease-in-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};
