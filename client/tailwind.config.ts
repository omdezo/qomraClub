import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0a0a0a',
        secondary: '#141414',
        elevated: '#1a1a1a',
        accent: {
          DEFAULT: '#d4a574',
          hover: '#e8c49a',
        },
        muted: '#4a4a4a',
        success: '#4ade80',
        error: '#f87171',
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        dialogue: ['var(--font-dialogue)', 'sans-serif'],
        'noto-arabic': ['var(--font-noto-arabic)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
