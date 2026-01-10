/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "dm-sans": ["var(--font-dm-sans)"],
        playfair: ["var(--font-playfair)"],
      },
    },
  },
  plugins: [],
};
