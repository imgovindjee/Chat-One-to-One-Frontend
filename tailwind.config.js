/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './components/**/*.{html,js}',
    './pages/**/*.{html,js}',
  ],
  theme: {
    extend: {
      colors:{
        primary: "#00acb4",
        secondary: "#059187"
      }
    },
  },
  plugins: [],
}

