/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables class-based dark mode toggling
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          light: '#6366F1',
          dark: '#3730A3',
        },
        secondary: {
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
          dark: '#0891B2',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        darkBg: '#09090B',
        darkCard: '#18181B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'glow-gradient': 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2.5s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: 0.2 },
          '50%': { transform: 'translateY(100%)', opacity: 0.9 },
        }
      }
    },
  },
  plugins: [],
}
