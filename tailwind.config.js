/** @type {import('tailwindcss').Config} */

const scrollbarHide = require("tailwind-scrollbar-hide");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [scrollbarHide],
};
