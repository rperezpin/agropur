import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'green-primary': '#4a7c3f',
        'green-mid': '#6aab5e',
        'blue-accent': '#1a5fa8',
        'blue-dark': '#0f3d70',
        'gray-brand': '#f4f6f3',
        'gray-mid': '#6b7280',
        'gray-dark': '#1f2937',
        'black-soft': '#111827',
        'innovation': '#16a34a',
        'innovation-light': '#dcfce7',
      },
      fontFamily: {
        heading: ['Raleway', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      typography: (theme) => ({
        green: {
          css: {
            '--tw-prose-headings': theme('colors.green-primary'),
            '--tw-prose-links': theme('colors.green-primary'),
            '--tw-prose-bold': theme('colors.black-soft'),
          },
        },
      }),
    },
  },
  plugins: [typography],
}
