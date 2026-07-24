/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#090B14',
        surface: '#111827',
        panel: 'rgba(15, 23, 42, 0.9)',
        accent: '#8B5CF6',
        accentSoft: '#A78BFA',
      },
      boxShadow: {
        glow: '0 20px 90px rgba(59, 130, 246, 0.18)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top left, rgba(124, 58, 237, 0.2), transparent 25%), radial-gradient(circle at bottom right, rgba(37, 99, 235, 0.18), transparent 20%)',
      },
    },
  },
  plugins: [],
}
