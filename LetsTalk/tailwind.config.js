/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./App.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lightblue: {
          500: '#1E1D1D',
        },
        navajowhite:{
          100:'#FFE0B5'
        },
        cyan:{
          100:'#4DFFF3'
        },
        blackraisin:{
          100:'#1D1E2C'
        },
        springGreen:{
          100:'#307351'
        }
      },
    },
  },
  plugins: [],
}

