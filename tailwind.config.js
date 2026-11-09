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
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      colors: {
        sim: {
          bg: 'var(--sim-bg, #0B0F0D)',
          surface: 'var(--sim-surface, #121915)',
          elevated: 'var(--sim-elevated, #19221C)',
          hover: 'var(--sim-hover, #1E2922)',
          accent: 'var(--sim-accent, #A6D96A)',
          'accent-muted': 'var(--sim-accent-muted, rgba(166, 217, 106, 0.12))',
          'accent-glow': 'var(--sim-glow, rgba(166, 217, 106, 0.25))',
          secondary: 'var(--sim-secondary, #72BFA0)',
          'text-primary': 'var(--sim-text-primary, #E8EEE9)',
          'text-secondary': 'var(--sim-text-secondary, #89958C)',
          'text-muted': 'var(--sim-text-muted, #56635A)',
          danger: '#E16D6D',
          'danger-muted': 'rgba(225, 109, 109, 0.12)',
          border: 'var(--sim-border, #28332C)',
          'border-subtle': 'var(--sim-border-subtle, #1E2822)',
          'border-focus': 'var(--sim-border-focus, #3C4D42)',
        }
      },
      boxShadow: {
        'hud': '0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px var(--sim-border, #28332C)',
        'popover': '0 10px 38px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px var(--sim-border, #28332C)',
        'inset-subtle': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.04)',
      }
    },
  },
  plugins: [],
}
