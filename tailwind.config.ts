/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Quan trọng!
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fall: {
          "0%": {
            transform: "translate(0, 0) rotate(0deg)",
            opacity: "1",
          },
          "50%": {
            transform: "translate(30vw, 50vh) rotate(45deg)", // Đi vòng cung
          },
          "100%": {
            transform: "translate(50vw, 100vh) rotate(90deg)", // Xuống giữa và biến mất
            opacity: "0",
          },
        },
      },
      animation: {
        fall: "fall 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
