/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          light: '#1A2A3A',
          DEFAULT: '#0A1628',
          dark: '#050B14'
        },
        teal: {
          light: '#E6FBF7',
          DEFAULT: '#00D4AA',
          dark: '#00B38F'
        },
        gold: {
          light: '#FFF8E6',
          DEFAULT: '#FFB800',
          dark: '#E6A600'
        },
        graybg: '#F5F7FA',
        darktext: '#1A2332'
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 10px 30px -10px rgba(10, 22, 40, 0.1)',
        glow: '0 0 20px rgba(0, 212, 170, 0.15)',
        goldglow: '0 0 20px rgba(255, 184, 0, 0.15)'
      }
    },
  },
  plugins: [],
}
