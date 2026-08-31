/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bone: {
          DEFAULT: '#F4F1EA',
          deep: '#E9E5DA',
          dim: '#DDD8CB',
        },
        ink: {
          DEFAULT: '#100F0D',
          soft: '#2A2724',
          mute: '#57524A',
        },
        ash: "#736D63",
        terra: {
          DEFAULT: '#DA532C',
          deep: '#B33F1C',
        },
      },
      fontFamily: {
        display: ['Archivo', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.055em',
        tighter: '-0.035em',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        power: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
};
