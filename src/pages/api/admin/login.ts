import type { APIRoute } from 'astro'
import { compare } from 'bcryptjs'
import { createSessionCookie } from '../../../lib/auth'

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData()
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const adminUser = import.meta.env.ADMIN_USER || 'admin'
  const adminHash = import.meta.env.ADMIN_PASSWORD_HASH || ''

  if (username !== adminUser || !adminHash) {
    return redirect('/admin/login?error=1')
  }

  const isValid = await compare(password, adminHash)

  if (!isValid) {
    return redirect('/admin/login?error=1')
  }

  const cookie = createSessionCookie(username)

  return new Response(null, {
    status: 302,
    headers: {
      'Set-Cookie': cookie,
      Location: '/admin',
    },
  })
}
