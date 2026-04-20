/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stadium: {
          dark: '#0A0F1A',
          cyan: '#00F0FF',
          orange: '#FF5C00',
          red: '#FF003C'
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 10px #00F0FF, 0 0 20px #00F0FF',
        'neon-red': '0 0 10px #FF003C, 0 0 20px #FF003C',
        'neon-orange': '0 0 10px #FF5C00, 0 0 20px #FF5C00',
      }
    },
  },
  plugins: [],
}
