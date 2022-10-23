/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./example/**/*.vue', './index.html'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
