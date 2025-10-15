// tailwind.config.js
/** @type {import('tailwindcss').Config} */

// 1. SOLUCIÓN: Cambia 'require' por 'import'
import defaultTheme from 'tailwindcss/defaultTheme'; 

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 2. Usando la sintaxis de propagación (spread) con el objeto importado
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
        heading: ['Roboto Slab', ...defaultTheme.fontFamily.serif],
        mono: ['Menlo', 'Monaco', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
}