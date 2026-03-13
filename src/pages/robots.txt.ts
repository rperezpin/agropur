import type { APIRoute } from 'astro'

const robotsTxt = `
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${new URL('sitemap-index.xml', import.meta.env.SITE || 'https://www.agropur.es').href}
`.trim()

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
