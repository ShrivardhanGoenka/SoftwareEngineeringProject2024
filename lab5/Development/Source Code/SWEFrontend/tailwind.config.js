/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    function ({addUtilities}){
      const newUtility = {
        '.no-scroll-bar::webkit-scrollbar':{
          display: "none"
        },
        '.no-scroll-bar':{
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none'
        }
      };

      addUtilities(newUtility)
    }
  ],
}

