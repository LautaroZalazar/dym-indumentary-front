/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        as: { max: "360px" },
      },
      keyframes: {
        flipHorizontal: {
          "0%, 100%": {
            transform: "rotateY(0deg)",
          },
          "50%": {
            transform: "rotateY(180deg) scaleX(-1)",
          },
        },
      },
      animation: {
        flipHorizontal: "flipHorizontal 3s linear infinite",
      },
      colors: {
        dymOrange: "#F26426",
        dymBlack: "#18151A",
        dymAntiPop: "#F0DFDA",
      },
    },
  },
  plugins: [],
};
