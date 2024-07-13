import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  plugins: [require('tailwindcss-animated')]
};
export default config;
