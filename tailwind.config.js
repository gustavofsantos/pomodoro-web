module.exports = {
  purge: ["./pages/**/*.{jsx,tsx}", "./components/**/*.{jsx,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  plugins: [],
};
