/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'calm-bg': '#f5f3f0',
        'calm-text': '#3a3532',
        'calm-accent': '#8b7355',
        'narrator': '#6b5d54',
        'player': '#4a7c7e',
      },
    },
  },
  plugins: [],
}
