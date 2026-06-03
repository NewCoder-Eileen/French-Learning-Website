/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        french: {
          blue: '#1e3a8a',
          red: '#dc2626',
          'blue-light': '#dbeafe',
          'red-light': '#fee2e2',
        },
      },
    },
  },
  plugins: [],
}
