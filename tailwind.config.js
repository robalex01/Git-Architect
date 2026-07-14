/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './renderer/index.html',
    './renderer/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0c1013',
          50: '#141a1f',
          100: '#1a2129',
          200: '#212a33',
        },
        blueprint: {
          DEFAULT: '#4fb4c7',
          dim: 'rgba(79,180,199,0.25)',
          faint: 'rgba(79,180,199,0.09)',
        },
        signal: {
          DEFAULT: '#e2a542',
          dim: 'rgba(226,165,66,0.16)',
          hover: '#eeb75e',
        },
        ash: {
          DEFAULT: '#7c8b93',
          faint: '#4b5960',
          bright: '#e7edf0',
        },
        danger: {
          DEFAULT: '#e2574c',
          dim: 'rgba(226,87,76,0.15)',
        },
        success: {
          DEFAULT: '#5fbf77',
          dim: 'rgba(95,191,119,0.15)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        sans: ['Inter', '"Segoe UI"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        blueprint: '0 0 0 1px rgba(79,180,199,0.15), 0 8px 24px -8px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};

