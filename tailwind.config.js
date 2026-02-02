/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'calm-bg': '#f7f1e6',
        'calm-text': '#2b1a12',
        'calm-accent': '#b08a3a',
        'narrator': '#5a2c21',
        'player': '#0f4c5c',
      },
    },
  },
  plugins: [],
}
