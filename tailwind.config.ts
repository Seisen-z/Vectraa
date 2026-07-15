import type { Config } from 'tailwindcss';

const config: Config = {
  // Class-based dark mode for manual toggling
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand accent — dark orange, used sparingly for CTAs & highlights
        accent: {
          DEFAULT: '#E8590C',
          hover:   '#FF7A29',
          soft:    'rgba(232, 89, 12, 0.14)',
        },
        // Per-icon color palette — a product feature (icon variety), not site chrome
        neon: {
          pink:   '#FF2D78',
          purple: '#BE00FF',
          blue:   '#00B4FF',
          green:  '#00FF87',
          orange: '#FF6B00',
          yellow: '#FFE600',
          red:    '#FF2525',
          cyan:   '#00FFFF',
          violet: '#7B2FFF',
          lime:   '#AAFF00',
        },
        // Obsidian dark-theme surface scale
        dark: {
          900: '#0A0A0B',
          800: '#101012',
          700: '#16161A',
          600: '#1D1D22',
          500: '#28282D',
          400: '#3A3A40',
          300: '#5B5B64',
        },
        // Light theme surface colors
        light: {
          50:  '#FFFFFF',
          100: '#FAFAF9',
          200: '#F4F4F3',
          300: '#E5E5E3',
          400: '#D4D4D2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem',
      },
      boxShadow: {
        // Neon glow shadows
        'neon-pink':   '0 0 12px 2px rgba(255, 45, 120, 0.5)',
        'neon-purple': '0 0 12px 2px rgba(190, 0, 255, 0.5)',
        'neon-blue':   '0 0 12px 2px rgba(0, 180, 255, 0.5)',
        'neon-green':  '0 0 12px 2px rgba(0, 255, 135, 0.5)',
        'neon-orange': '0 0 12px 2px rgba(255, 107, 0, 0.5)',
        'neon-yellow': '0 0 12px 2px rgba(255, 230, 0, 0.5)',
        'neon-red':    '0 0 12px 2px rgba(255, 37, 37, 0.5)',
        'neon-cyan':   '0 0 12px 2px rgba(0, 255, 255, 0.5)',
        'card':        '0 4px 24px rgba(0,0,0,0.4)',
        'card-light':  '0 4px 24px rgba(0,0,0,0.08)',
      },
      animation: {
        'fade-in':     'fadeIn 0.2s ease-out',
        'slide-up':    'slideUp 0.3s ease-out',
        'slide-down':  'slideDown 0.3s ease-out',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
        'spin-slow':   'spin 3s linear infinite',
        'bounce-soft': 'bounceSoft 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',   opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        bounceSoft: {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(0.94)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      transitionDuration: {
        '250': '250ms',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
