/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        libre: ['"Libre Baskerville"', 'serif'],
      },
      fontWeight: {
        thin: '100',
      },
    },
  },
  plugins: [],
}
