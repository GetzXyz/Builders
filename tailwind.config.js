/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        forge: {
          bg: '#04080f',
          panel: '#0a1220',
          card: '#0d1526',
          border: '#1a2f50',
          accent: '#00f0ff',
          accent2: '#7b2fff',
          text: '#c8d8f0',
          text2: '#7090b0',
          gold: '#ffb700',
          success: '#00e676',
          danger: '#ff3c5a',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};