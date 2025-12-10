/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",   // <- change this if your index.html is in public
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
