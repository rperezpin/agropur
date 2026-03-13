import Database from 'better-sqlite3'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const DB_PATH = import.meta.env.DB_PATH || './data/agropur.db'

// Ensure directory exists
const dir = dirname(DB_PATH)
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true })
}

const db = new Database(DB_PATH)

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL')

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    empresa TEXT,
    email TEXT NOT NULL,
    telefono TEXT NOT NULL,
    servicio TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    leido INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT NOT NULL,
    perfil TEXT NOT NULL,
    experiencia TEXT,
    cv_path TEXT,
    leido INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`)

// ── Contact functions ──

export interface ContactInput {
  nombre: string
  empresa?: string
  email: string
  telefono: string
  servicio: string
  mensaje: string
}

export interface Contact extends ContactInput {
  id: number
  leido: number
  created_at: string
}

const insertContactStmt = db.prepare(`
  INSERT INTO contacts (nombre, empresa, email, telefono, servicio, mensaje)
  VALUES (@nombre, @empresa, @email, @telefono, @servicio, @mensaje)
`)

export function insertContact(data: ContactInput): number {
  const result = insertContactStmt.run({
    ...data,
    empresa: data.empresa || null,
  })
  return result.lastInsertRowid as number
}

export function getContacts(onlyUnread = false): Contact[] {
  const where = onlyUnread ? 'WHERE leido = 0' : ''
  return db.prepare(`SELECT * FROM contacts ${where} ORDER BY created_at DESC`).all() as Contact[]
}

export function getContactStats(): { total: number; unread: number } {
  const total = (db.prepare('SELECT COUNT(*) as count FROM contacts').get() as { count: number }).count
  const unread = (db.prepare('SELECT COUNT(*) as count FROM contacts WHERE leido = 0').get() as { count: number }).count
  return { total, unread }
}

export function markContactRead(id: number): void {
  db.prepare('UPDATE contacts SET leido = 1 WHERE id = ?').run(id)
}

// ── Application functions ──

export interface ApplicationInput {
  nombre: string
  email: string
  telefono: string
  perfil: string
  experiencia?: string
  cv_path?: string
}

export interface Application extends ApplicationInput {
  id: number
  leido: number
  created_at: string
}

const insertApplicationStmt = db.prepare(`
  INSERT INTO applications (nombre, email, telefono, perfil, experiencia, cv_path)
  VALUES (@nombre, @email, @telefono, @perfil, @experiencia, @cv_path)
`)

export function insertApplication(data: ApplicationInput): number {
  const result = insertApplicationStmt.run({
    ...data,
    experiencia: data.experiencia || null,
    cv_path: data.cv_path || null,
  })
  return result.lastInsertRowid as number
}

export function getApplications(onlyUnread = false): Application[] {
  const where = onlyUnread ? 'WHERE leido = 0' : ''
  return db.prepare(`SELECT * FROM applications ${where} ORDER BY created_at DESC`).all() as Application[]
}

export function getApplicationStats(): { total: number; unread: number } {
  const total = (db.prepare('SELECT COUNT(*) as count FROM applications').get() as { count: number }).count
  const unread = (db.prepare('SELECT COUNT(*) as count FROM applications WHERE leido = 0').get() as { count: number }).count
  return { total, unread }
}

export function markApplicationRead(id: number): void {
  db.prepare('UPDATE applications SET leido = 1 WHERE id = ?').run(id)
}
