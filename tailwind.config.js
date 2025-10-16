module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: true, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "fern-green": "#4f714a",
        "delft-blue": "#3d3c5d",
        "dark-purple": "#371b37",
        "dark-purple-2": "#261426",
        "licorice-dark": "#1b0d12",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
