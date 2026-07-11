module.exports = {
  darkMode: 'class',
  content: ['./*.html', './js/**/*.js'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      colors: {
        slate: {
          50: '#f5f5f7',
          100: '#f5f5f7',
          200: '#e8e8ed',
          300: '#d2d2d7',
          400: '#86868b',
          500: '#6e6e73',
          600: '#515154',
          700: '#424245',
          800: '#1d1d1f',
          850: '#161617',
          900: '#000000',
        },
        indigo: {
          400: '#2997ff',
          500: '#0071e3',
          600: '#0077ed',
        },
        sky: { 400: '#2997ff', 500: '#0071e3' },
        btc: { DEFAULT: '#f7931a', dark: '#c67612' },
      },
    },
  },
};
