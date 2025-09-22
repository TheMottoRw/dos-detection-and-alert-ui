/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#05156d',
          600: 'rgba(23,51,168,0.86)',
          700: '#4453ef'
        }
      },
    },
  },
  plugins: [],
}
