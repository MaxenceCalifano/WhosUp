/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.js",
    "./components/**/*.{js,jsx}",
    "./screens/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#96C09F",
      },
    },
  },
  plugins: [],
};
