// Shared Tailwind config — Apple-inspired palette for light + dark.
// Loaded after the Tailwind CDN script on every page.
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      colors: {
        // Remap slate onto Apple grays so existing classes pick up the palette
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
        // Remap indigo/sky onto Apple blues
        indigo: {
          400: '#2997ff',
          500: '#0071e3',
          600: '#0077ed',
        },
        sky: { 400: '#2997ff', 500: '#0071e3' },
        // Bitcoin orange accent
        btc: { DEFAULT: '#f7931a', dark: '#c67612' },
      },
    },
  },
};
