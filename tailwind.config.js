/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{html,md,11ty.js,liquid,njk,hbs,mustache,ejs,haml,pug}",
    "./src/index.{html,md,11ty.js,liquid,njk,hbs,mustache,ejs,haml,pug}"
  ],
  theme: {
    fontFamily: {
      'sans': ['Hanken Grotesk', ...defaultTheme.fontFamily.sans]

    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],

}

