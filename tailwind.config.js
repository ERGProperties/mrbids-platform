/** @type {import('tailwindcss').Config} */

const scrollbarHide = require("tailwind-scrollbar-hide");
const typography = require("@tailwindcss/typography");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    scrollbarHide,
    typography,
  ],
};
