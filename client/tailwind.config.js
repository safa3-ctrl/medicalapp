/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  mode:'jit',
  theme: {
    extend: {
      backgroundImage: {
        'home': "url('/src/images/bg.png')",
        
      },
      colors:{
        primary: "#252652"
      }
    },
  },
  plugins: [],
}