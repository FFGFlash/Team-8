/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin')
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  darkMode: 'class',
  plugins: [
    '@tailwindcss/forms',
    '@tailwindcss/typography',
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'text-shadow': value => ({ textShadow: value })
        },
        { values: theme('textShadow') }
      )
    })
  ],
  theme: {
    fontSize: {
      'xxs': '1rem',
      'xs': '1.2rem',
      'sm': '1.4rem',
      'base': '1.6rem',
      'lg': '2rem',
      'xl': '2.5rem',
      '2xl': '3rem',
      '3xl': '3.5rem',
      '4xl': '4rem',
      '5xl': '4.5rem',
      '6xl': '5rem',
      'inherit': 'inherit'
    },
    screens: {
      'xs': '500px',
      ...defaultTheme.screens,
      '3xl': '1750px',
      'iphone-land': { raw: '(max-height: 414px) and (max-width: 896px)' },
      'iphone-se-land': { raw: '(max-height: 375px) and (max-width: 667px)' },
      'iphone-port': { raw: '(max-width: 414px) and (max-height: 896px)' },
      'iphone-se-port': { raw: '(max-width: 375px) and (max-height: 667px)' },
      'iphone-max-land': { raw: '(max-width: 926px) and (max-height: 428px)' },
      'iphone-max-port': { raw: '(max-width: 428px) and (max-height: 926px)' },
      'iphone-11-port': { raw: '(max-width: 375px) and (max-height: 812px)' },
      'iphone-11-land': { raw: '(max-width: 812px) and (max-height: 375px)' },
      'iphone-13-port': { raw: '(max-width: 390px) and (max-height: 844px)' },
      'iphone-13-land': { raw: '(max-width: 844px) and (max-height: 390px)' },
      'galaxy-s20-port': { raw: '(max-width: 384px) and (max-height: 854px)' },
      'galaxy-s20-land': { raw: '(max-width: 854px) and (max-height: 384px)' },
      'galaxy-s20-ult-land': {
        raw: '(max-width: 915px) and (max-height: 412px)'
      },
      'galaxy-s20-ult-port': {
        raw: '(max-width: 412px) and (max-height: 915px)'
      },
      'surf-duo-land': {
        raw: '(max-height: 540px) and (max-width: 720px) and (min-height: 539px) and (min-width: 719px)'
      },
      'surf-duo-port': { raw: '(max-width: 540px) and (max-height: 720px)' },
      'sam-gal-ultra-land': {
        raw: '(max-height: 412px) and (max-width: 915px)'
      },
      'sam-gal-ultra-port': {
        raw: '(max-width: 412px) and (max-height: 915px)'
      },
      'ipad-land': { raw: '(max-height: 820px) and (max-width: 1180px)' },
      'ipad-port': { raw: '(max-width: 820px) and (max-height: 1180px)' },
      'ipad-mini-land': {
        raw: '(max-height: 768px) and (max-width: 1024px) and (min-width: 1000px)'
      },
      'nest-hub-land': { raw: '(max-height: 600px) and (max-width: 1024px)' },
      'nest-hub-port': { raw: '(max-width: 600px) and (max-height: 1024px)' }
    },
    textShadow: {
      circuit: '2px 2px 5px gray',
      sm: '0 1px 2px var(--tw-shadow-color)',
      DEFAULT: '0 2px 4px var(--tw-shadow-color)',
      lg: '0 8px 16px var(--tw-shadow-color)'
    },
    extend: {
      animation: {
        'loading': 'spin 2s linear infinite, dash 1.5s ease-in-out infinite',
        'slide-in':
          'slide-in 0.2s ease-in-out forwards, fade-in 0.15s ease-in-out forwards',
        'slide-out':
          'slide-out 0.2s ease-in-out forwards, fade-out 0.15s ease-in-out forwards'
      },
      keyframes: {
        'dash': {
          '0%': { 'stroke-dasharray': '1, 150', 'stroke-dashoffset': '0' },
          '50%': { 'stroke-dasharray': '90, 150', 'stroke-dashoffset': '-35' },
          '100%': { 'stroke-dasharray': '90, 150', 'stroke-dashoffset': '-124' }
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' }
        },
        'slide-in': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' }
        },
        'slide-out': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' }
        }
      },
      maxWidth: {
        '6xl': '90rem',
        '7xl': '110rem',
        '8xl': '150rem',
        '9xl': '190rem'
      },
      scale: {
        102: '1.025'
      },
      minHeight: {
        96: '24rem'
      }
    }
  }
}

module.exports = config
