/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme'; 

export default {
  
    darkMode: 'class', 
    
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
             
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],
                heading: ['Roboto Slab', ...defaultTheme.fontFamily.serif],
                mono: ['Menlo', 'Monaco', ...defaultTheme.fontFamily.mono],
            },
        },
    },
    plugins: [],
}