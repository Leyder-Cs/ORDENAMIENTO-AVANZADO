/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: '#05060a',
        neonPink: '#ff2bd6',
        neonCyan: '#00f0ff',
        neonYellow: '#f9f002',
        neonGreen: '#39ff14',
      },
    },
  },
  plugins: [],
}
