/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
        orbitron: ['Orbitron', 'sans-serif'],
        jetbrains: ['JetBrains Mono', 'monospace'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'cyber-grid': '40px 40px',
      },
    },
  },
  plugins: [],
};