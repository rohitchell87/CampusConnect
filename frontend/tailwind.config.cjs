module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5fbff',
          100: '#e6f3ff',
          200: '#bfe6ff',
          300: '#99d8ff',
          400: '#4db8ff',
          500: '#0098ff',
          600: '#0077cc',
          700: '#005599',
          800: '#003366',
          900: '#001133'
        },
        accent: '#7c3aed'
      }
    }
  },
  plugins: [],
}
