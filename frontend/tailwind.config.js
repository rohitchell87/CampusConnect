import forms from '@tailwindcss/forms';

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        glass: 'rgba(255,255,255,0.12)',
      },
    },
  },
  plugins: [forms],
};
