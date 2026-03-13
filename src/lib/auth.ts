import { createHmac } from 'node:crypto'

const SESSION_SECRET = import.meta.env.SESSION_SECRET || 'dev_secret_key_change_in_production_32'
const COOKIE_NAME = 'agropur_session'
const MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

function sign(value: string): string {
  const signature = createHmac('sha256', SESSION_SECRET)
    .update(value)
    .digest('base64url')
  return `${value}.${signature}`
}

function unsign(signedValue: string): string | null {
  const lastDotIndex = signedValue.lastIndexOf('.')
  if (lastDotIndex === -1) return null

  const value = signedValue.slice(0, lastDotIndex)
  const expected = sign(value)

  if (expected !== signedValue) return null
  return value
}

export function createSessionCookie(username: string): string {
  const payload = JSON.stringify({
    user: username,
    exp: Date.now() + MAX_AGE * 1000,
  })
  const signed = sign(Buffer.from(payload).toString('base64url'))

  return `${COOKIE_NAME}=${signed}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${MAX_AGE}`
}

export function verifySession(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false

  const cookies = cookieHeader.split(';').map((c) => c.trim())
  const sessionCookie = cookies.find((c) => c.startsWith(`${COOKIE_NAME}=`))
  if (!sessionCookie) return false

  const value = sessionCookie.slice(COOKIE_NAME.length + 1)
  const unsigned = unsign(value)
  if (!unsigned) return false

  try {
    const payload = JSON.parse(Buffer.from(unsigned, 'base64url').toString())
    if (!payload.exp || payload.exp < Date.now()) return false
    return true
  } catch {
    return false
  }
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
}
