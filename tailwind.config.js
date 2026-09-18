/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#EB0028',
          redDark: '#C40020',
          cyan: '#00F0FF',
          dark: '#080808',
          surface: '#121212',
          card: '#1A1A1A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        condensed: ['"Barlow Condensed"', 'Oswald', 'sans-serif'],
        display: ['"Bebas Neue"', 'Oswald', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
