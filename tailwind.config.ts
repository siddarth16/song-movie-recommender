import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          900: '#9a3412',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          900: '#164e63',
        },
        surface: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1', fontWeight: '900' }],
        'title': ['3rem', { lineHeight: '1.2', fontWeight: '800' }],
        'heading': ['2rem', { lineHeight: '1.3', fontWeight: '700' }],
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      },
      dropShadow: {
        'brutal': '4px 4px 0px #000000',
        'brutal-sm': '2px 2px 0px #000000',
        'brutal-lg': '6px 6px 0px #000000',
        'brutal-xl': '8px 8px 0px #000000',
        'brutal-hover': '2px 2px 0px #000000',
        'brutal-active': '1px 1px 0px #000000',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
      }
    },
  },
  plugins: [],
};

export default config;