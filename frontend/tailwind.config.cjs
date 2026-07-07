module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#6366F1',
        secondary: '#8B5CF6',
        navy: '#0B1020',
        'navy-dark': '#090F1B',
        'surface-secondary': '#131A2A',
        glass: 'rgba(255,255,255,0.05)',
        accent: {
          primary: '#6366F1',
          secondary: '#8B5CF6'
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        text: {
          primary: '#F8FAFC',
          secondary: '#CBD5E1',
          muted: '#64748B'
        },
        border: {
          glass: 'rgba(255,255,255,0.08)'
        }
      },
      boxShadow: {
        soft: '0 24px 80px -32px rgba(0, 0, 0, 0.3)',
        card: '0 40px 120px rgba(0, 0, 0, 0.3)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.2)',
        glow: '0 0 40px rgba(124, 58, 237, 0.2)'
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '22px',
        xl: '32px'
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem'
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.5)' }
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        }
      }
    }
  },
  plugins: [],
}
