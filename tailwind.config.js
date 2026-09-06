/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#16324F',
        'navy-dark': '#0D1F33',
        'navy-mid': '#1a3d60',
        gold: '#C9A24B',
        teal: '#1F7A6C',
        info: '#2B6CB0',
        danger: '#C0392B',
        surface: '#FFFFFF',
        border: '#E1E4E8',
        'text-primary': '#1B1F27',
        'text-secondary': '#5B6472',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
