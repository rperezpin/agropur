import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import preact from '@astrojs/preact'
import node from '@astrojs/node'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    tailwind(),
    preact({ compat: true }),
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/api'),
    }),
  ],
  site: 'https://www.agropur.es',
})
