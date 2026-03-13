# AGROPUR CENTRO GESTOR S.L. — Proyecto Web Corporativa

## Descripción del Proyecto

Web corporativa profesional para **Agropur Centro Gestor S.L.**, empresa especializada en la gestión integral de purines y deyecciones porcinas con sede en Ejea de los Caballeros (Zaragoza), operando en las comarcas de Hoya de Huesca, Cinco Villas y Rivera Alta de Navarra.

**Objetivos estratégicos:**
1. **Imagen corporativa profesional y de confianza** — seriedad, experiencia y liderazgo sectorial.
2. **Captación de personal cualificado** — sección dedicada a incorporar empleados para escalar el negocio.
3. **Posicionamiento en digestato de purín** — novedad diferenciadora en el sector.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | **Astro 4** con SSR (`output: 'server'`) |
| Adaptador | **`@astrojs/node`** — despliegue Node.js en Plesk/Arsys |
| Islas interactivas | **Preact** (formularios, menú mobile) |
| Estilos | **Tailwind CSS** via `@astrojs/tailwind` |
| Formularios | Preact + Zod (validación servidor) |
| Email | **Nodemailer** con SMTP de Arsys |
| Panel Admin | Páginas `/admin/*` protegidas con middleware Astro |
| Almacenamiento | **SQLite** (via `better-sqlite3`) — ligero, sin servidor de BD |
| Animaciones | **AOS** (Animate On Scroll) — CSS, sin bundle pesado |
| Imágenes | `astro:assets` con optimización automática |
| Deploy | **Arsys + Plesk** — Node.js Passenger o PM2 |

> **¿Por qué Preact y no React?** Pesa ~3KB vs ~45KB. Para los formularios de esta web es más que suficiente y mantiene la carga ultrarrápida de Astro.

> **¿Por qué SQLite?** El panel de admin necesita persistir contactos y candidaturas. SQLite es un fichero local, sin instalar MySQL ni PostgreSQL. Perfecto para una web de este tamaño en Arsys.

---

## Configuración Astro

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import preact from '@astrojs/preact'
import node from '@astrojs/node'

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [tailwind(), preact({ compat: true })],
  site: 'https://www.agropur.es',
})
```

Las páginas estáticas (home, servicios, etc.) llevan `export const prerender = true` → se generan como HTML puro en build → máximo rendimiento. Solo los endpoints de API y el panel admin son SSR puro.

---

## Estructura de Archivos

```
agropur-web/
├── src/
│   ├── pages/
│   │   ├── index.astro                    # Home
│   │   ├── servicios.astro
│   │   ├── digestato.astro
│   │   ├── sobre-nosotros.astro
│   │   ├── trabaja-con-nosotros.astro
│   │   ├── contacto.astro
│   │   ├── aviso-legal.astro
│   │   ├── privacidad.astro
│   │   ├── cookies.astro
│   │   ├── api/
│   │   │   ├── contact.ts                 # POST — guarda en DB + envía email
│   │   │   ├── apply.ts                   # POST — guarda candidatura + CV
│   │   │   └── admin/
│   │   │       ├── login.ts               # POST login
│   │   │       └── logout.ts              # POST logout
│   │   └── admin/
│   │       ├── index.astro                # Dashboard (SSR, protegido)
│   │       ├── contactos.astro            # Mensajes de contacto recibidos
│   │       └── candidaturas.astro         # Candidaturas recibidas + descargar CV
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── MobileMenu.tsx             # Isla Preact
│   │   ├── home/
│   │   │   ├── Hero.astro
│   │   │   ├── StatsBar.astro
│   │   │   ├── ServicesGrid.astro
│   │   │   ├── DigestatoTeaser.astro
│   │   │   ├── WhyAgropur.astro
│   │   │   ├── GeographyBlock.astro
│   │   │   └── HomeCTA.astro
│   │   ├── shared/
│   │   │   ├── ContactForm.tsx            # Isla Preact
│   │   │   ├── JobApplicationForm.tsx     # Isla Preact
│   │   │   └── PageHero.astro
│   │   └── admin/
│   │       ├── ContactsTable.astro
│   │       └── ApplicationsTable.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── AdminLayout.astro
│   ├── lib/
│   │   ├── mailer.ts                      # Nodemailer SMTP Arsys
│   │   ├── auth.ts                        # Sesión admin (cookie firmada)
│   │   └── db.ts                          # better-sqlite3 helpers
│   ├── middleware.ts                       # Protege /admin/* → redirige a login
│   └── styles/
│       └── global.css
├── data/
│   └── agropur.db                         # SQLite — gitignore este archivo
├── uploads/
│   └── cv/                                # CVs subidos — gitignore
├── public/
│   ├── logo-agropur.png
│   ├── favicon.ico
│   └── images/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## Comandos

```bash
# Crear proyecto
npm create astro@latest agropur-web -- --template minimal --typescript strict
cd agropur-web
npx astro add tailwind preact node

# Dependencias adicionales
npm install nodemailer zod better-sqlite3 bcryptjs
npm install -D @types/nodemailer @types/better-sqlite3 @types/bcryptjs

# Desarrollo
npm run dev

# Build
npm run build
# Genera: dist/server/entry.mjs  +  dist/client/ (assets estáticos)

# Preview del build
npm run preview
```

---

## Despliegue en Arsys / Plesk

Ver `DEPLOY.md` para instrucciones completas. Resumen:

1. `npm run build` en local
2. Subir `dist/`, `package.json`, `package-lock.json` al servidor (FTP/SSH/Git)
3. En servidor: `npm install --production`
4. En Plesk → Node.js → Application root: carpeta del proyecto, Startup file: `dist/server/entry.mjs`
5. Variables de entorno en Plesk → Environment Variables
6. Plesk usa Passenger para gestionar el proceso Node automáticamente

---

## Variables de Entorno

```env
# SMTP Arsys
SMTP_HOST=mail.arsys.es
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@agropur.es
SMTP_PASS=xxxxxxxxxx

# Destinos de email
CONTACT_EMAIL=info@agropur.es
JOB_EMAIL=rrhh@agropur.es

# Admin panel
ADMIN_USER=admin
ADMIN_PASSWORD_HASH=$2b$10$xxxxxxxxxxxxx   # bcrypt hash — nunca plaintext

# Sesión
SESSION_SECRET=string_aleatorio_minimo_32_chars

# Rutas
UPLOAD_DIR=/var/www/agropur/uploads/cv
DB_PATH=/var/www/agropur/data/agropur.db

# Site
PUBLIC_SITE_URL=https://www.agropur.es
```

---

## Documentos de Referencia

| Archivo | Descripción |
|---|---|
| `AGENTS.md` | Instrucciones detalladas para el agente IA constructor |
| `BRAND.md` | Identidad visual, colores, tipografías y tono |
| `CONTENT.md` | Todos los textos y copies de cada página |
| `PAGES.md` | Especificación de componentes y UX por página |
| `SEO.md` | Estrategia SEO, metadatos y Schema.org |
| `DEPLOY.md` | Guía de despliegue en Arsys/Plesk paso a paso |
