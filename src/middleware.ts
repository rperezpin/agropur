import { defineMiddleware } from 'astro:middleware'
import { verifySession } from './lib/auth'

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url

  // Only protect /admin/* routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const cookieHeader = context.request.headers.get('cookie')
    const isValid = verifySession(cookieHeader)

    if (!isValid) {
      return context.redirect('/admin/login')
    }
  }

  return next()
})
