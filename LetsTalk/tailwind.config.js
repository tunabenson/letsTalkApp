/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./App.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lightblue: {
          500: 'rgb(0, 157, 245)',
        },
      },
    },
  },
  plugins: [],
}

