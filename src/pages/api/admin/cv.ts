import type { APIRoute } from 'astro'
import { verifySession } from '../../../lib/auth'
import { readFileSync, existsSync } from 'node:fs'
import Database from 'better-sqlite3'

export const GET: APIRoute = async ({ request, url }) => {
  // Verify session
  const cookieHeader = request.headers.get('cookie')
  if (!verifySession(cookieHeader)) {
    return new Response('No autorizado', { status: 401 })
  }

  const id = url.searchParams.get('id')
  if (!id) {
    return new Response('ID requerido', { status: 400 })
  }

  const DB_PATH = import.meta.env.DB_PATH || './data/agropur.db'
  const db = new Database(DB_PATH)
  const app = db.prepare('SELECT cv_path FROM applications WHERE id = ?').get(Number(id)) as { cv_path: string | null } | undefined

  if (!app?.cv_path || !existsSync(app.cv_path)) {
    return new Response('CV no encontrado', { status: 404 })
  }

  const file = readFileSync(app.cv_path)
  return new Response(file, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="cv-${id}.pdf"`,
    },
  })
}
