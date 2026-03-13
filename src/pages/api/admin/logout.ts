import type { APIRoute } from 'astro'
import { clearSessionCookie } from '../../../lib/auth'

export const POST: APIRoute = async () => {
  const cookie = clearSessionCookie()

  return new Response(null, {
    status: 302,
    headers: {
      'Set-Cookie': cookie,
      Location: '/admin/login',
    },
  })
}
