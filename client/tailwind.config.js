/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Yeh line batati hai ki src folder ke andar ki sabhi files par Tailwind chalega
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}