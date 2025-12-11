/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', '"Cinzel"', 'serif'],
        sans: ['Inter', 'Lato', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
        display: ['Oswald', 'Anton', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
}
