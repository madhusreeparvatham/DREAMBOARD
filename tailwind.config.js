/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: { DEFAULT: '#DCCBFF', light: '#EDE0FF', dark: '#C4ADFF' },
        'pastel-pink': { DEFAULT: '#F8D9E8', light: '#FCF0F6', dark: '#F0C0D8' },
        'baby-blue': { DEFAULT: '#D9ECFF', light: '#EEF6FF', dark: '#BAD9FF' },
        cream: { DEFAULT: '#FFF9F1', dark: '#F5EEE3' },
        'deep-purple': { DEFAULT: '#59436F', light: '#7A6490', dark: '#3D2D52' },
        'soft-rose': { DEFAULT: '#E9AFC5', light: '#F3CDD9', dark: '#D990B2' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'gradient': 'gradientShift 8s ease infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.3) rotate(180deg)', opacity: '0.6' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.8)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backgroundSize: {
        '300%': '300%',
        '200%': '200%',
      },
      boxShadow: {
        'dreamy': '0 8px 32px rgba(89,67,111,0.12), 0 2px 8px rgba(220,203,255,0.25)',
        'dreamy-lg': '0 16px 48px rgba(89,67,111,0.18), 0 4px 16px rgba(220,203,255,0.3)',
        'glow': '0 0 20px rgba(220,203,255,0.6), 0 0 40px rgba(248,217,232,0.3)',
        'glow-purple': '0 0 20px rgba(89,67,111,0.3), 0 0 40px rgba(220,203,255,0.4)',
        'card': '0 4px 24px rgba(89,67,111,0.08), 0 1px 4px rgba(89,67,111,0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

