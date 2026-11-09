/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      colors: {
        game: {
          dark: '#0b0f17',
          panel: '#111827',
          panelBorder: '#1f293d',
          accent: '#10b981',
          accentGlow: '#059669',
        }
      },
      boxShadow: {
        'glow-emerald': '0 0 15px -3px rgba(16, 185, 129, 0.3), 0 0 6px -2px rgba(16, 185, 129, 0.2)',
        'glow-cyan': '0 0 15px -3px rgba(6, 182, 212, 0.3), 0 0 6px -2px rgba(6, 182, 212, 0.2)',
        'glow-amber': '0 0 15px -3px rgba(245, 158, 11, 0.3), 0 0 6px -2px rgba(245, 158, 11, 0.2)',
        'hud': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
