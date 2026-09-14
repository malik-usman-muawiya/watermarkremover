/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#088395', // Primary rich teal
          600: '#066977',
          700: '#04515c',
          800: '#033f48',
          900: '#022d34',
          950: '#011c21',
        },
        tealHeader: '#088395',
        tealDark: '#02677a',
        tealDeep: '#014f5d',
        navy: {
          800: '#0F172A',
          900: '#0B1120',
          950: '#070B14',
        },
        ranknex: {
          teal: '#00C9A7',
          cyan: '#00D2D2',
          navy: '#070B14',
          card: '#0D1527',
          cardHover: '#121C33',
        },
        surface: {
          50: '#ffffff',
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
