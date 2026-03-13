# AGENTS.md — Instrucciones para el Agente IA

## Rol y Objetivo

Eres un desarrollador web full-stack senior especializado en webs corporativas B2B. Tu misión es construir la web oficial de **Agropur Centro Gestor S.L.** usando **Astro 4 con SSR**, desplegada en **Arsys con Plesk**.

La web debe transmitir: profesionalidad, innovación técnica (digestato), capacidad de crecimiento (captación de personal) y confianza para ganaderos, agricultores y organismos reguladores.

---

## Stack Obligatorio

- **Astro 4** con `output: 'server'` y adaptador `@astrojs/node`
- **Preact** para islas interactivas (formularios, menú mobile)
- **Tailwind CSS** para estilos
- **Nodemailer** para envío de emails vía SMTP Arsys
- **better-sqlite3** para persistencia de contactos y candidaturas
- **bcryptjs** para hash de contraseña del admin
- **Zod** para validación de formularios en servidor
- **AOS** (Animate On Scroll) cargado desde CDN en BaseLayout

No usar React, Vue, ni ningún otro framework de UI. No usar bases de datos externas (MySQL, MongoDB, etc.) — solo SQLite local.

---

## Reglas Generales de Código

### Astro
- Cada página pública lleva `export const prerender = true` al inicio → HTML estático en build
- Las páginas `/admin/*` y los endpoints `/api/*` NO llevan prerender → SSR puro
- Componentes `.astro` para todo lo que no necesite interactividad en cliente
- Islas Preact (`.tsx`) solo para: formularios, menú hamburger mobile, cualquier componente con estado cliente
- Las islas se montan con `client:load` si son visibles inmediatamente, `client:visible` si están below-the-fold

### TypeScript
- `strict: true` en `tsconfig.json`
- Interfaces para todos los tipos de datos (ContactSubmission, JobApplication, etc.)
- Sin `any` — si es necesario, usar `unknown` y tipar correctamente

### Estilos
- Tailwind CSS únicamente — sin CSS-in-JS ni módulos CSS salvo `global.css` para variables y resets
- Definir colores de marca en `tailwind.config.mjs` como tokens nombrados (`green-primary`, `orange-accent`, etc.)
- Mobile-first: estilos base para móvil, modificadores `md:` y `lg:` para desktop

### Rendimiento
- `<Image>` de `astro:assets` para TODAS las imágenes locales
- Imágenes externas: atributo `loading="lazy"` manual
- AOS solo para animaciones de aparición — sin librerías de animación pesadas
- Fuentes: Google Fonts cargadas con `<link rel="preconnect">` + `display=swap`

### Accesibilidad
- HTML semántico en todos los componentes
- `aria-label` en botones sin texto visible
- `alt` descriptivo en español en todas las imágenes de contenido; `alt=""` en decorativas
- Focus visible — no eliminar outline sin añadir alternativa visible

---

## Implementación: Endpoints de API

### `src/pages/api/contact.ts`
```typescript
// Método: POST
// Body: { nombre, empresa?, email, telefono, servicio, mensaje }
// Acciones:
//   1. Validar con Zod
//   2. Guardar en tabla `contacts` de SQLite con timestamp
//   3. Enviar email de notificación a CONTACT_EMAIL vía Nodemailer
//   4. Responder { success: true } o { success: false, errors: [...] }
```

### `src/pages/api/apply.ts`
```typescript
// Método: POST (multipart/form-data — lleva fichero CV)
// Body: { nombre, email, telefono, perfil, experiencia, cv: File, lopd: 'true' }
// Acciones:
//   1. Validar campos con Zod
//   2. Guardar CV en UPLOAD_DIR con nombre único (uuid + extensión original)
//   3. Guardar en tabla `applications` de SQLite con ruta al CV
//   4. Enviar email de notificación a JOB_EMAIL
//   5. Responder { success: true } o { success: false, errors: [...] }
// Validaciones: CV solo PDF, máximo 5MB
```

### `src/pages/api/admin/login.ts`
```typescript
// Método: POST
// Body: { username, password }
// Acciones:
//   1. Comparar username con ADMIN_USER
//   2. Verificar password con bcrypt contra ADMIN_PASSWORD_HASH
//   3. Si correcto: crear cookie de sesión firmada con SESSION_SECRET (httpOnly, sameSite: strict)
//   4. Redirigir a /admin
//   5. Si incorrecto: redirigir a /admin/login?error=1
```

### `src/pages/api/admin/logout.ts`
```typescript
// Método: POST
// Acciones: borrar cookie de sesión → redirigir a /admin/login
```

---

## Implementación: Middleware

### `src/middleware.ts`
```typescript
// Proteger todas las rutas que empiecen por /admin/ (excepto /admin/login)
// Si no hay cookie de sesión válida → redirect a /admin/login
// Usar import { defineMiddleware } from 'astro:middleware'
```

---

## Implementación: Base de Datos SQLite

### `src/lib/db.ts`

Crear y gestionar dos tablas:

```sql
-- Mensajes de contacto
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

-- Candidaturas de empleo
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
```

Exportar funciones: `insertContact()`, `getContacts()`, `markContactRead()`, `insertApplication()`, `getApplications()`, `markApplicationRead()`

---

## Implementación: Panel de Admin

### Diseño del panel
- Layout limpio y funcional — no necesita ser bonito, sí usable
- Sidebar con: Dashboard | Contactos | Candidaturas | Cerrar sesión
- Sin librerías de UI externas para el admin — Tailwind puro

### `src/pages/admin/index.astro`
- Métricas: total contactos, no leídos, total candidaturas, no leídas
- Links rápidos a secciones

### `src/pages/admin/contactos.astro`
- Tabla con: fecha, nombre, empresa, email, teléfono, servicio, mensaje (truncado), estado (leído/no leído)
- Click en fila → expandir mensaje completo
- Botón "Marcar como leído"
- Ordenar por fecha desc por defecto

### `src/pages/admin/candidaturas.astro`
- Tabla con: fecha, nombre, email, teléfono, perfil, resumen, enlace para descargar CV
- Botón "Marcar como leído"
- El enlace de descarga del CV debe estar protegido (solo accesible si hay sesión activa)

### `src/pages/admin/login.astro`
- Formulario simple: usuario + contraseña
- Si `?error=1` en URL: mostrar mensaje de error
- Esta página NO está protegida por middleware

---

## Implementación: Formularios (Islas Preact)

### `src/components/shared/ContactForm.tsx`

Estado interno: campos del formulario, errores de validación, estado de envío (idle | loading | success | error)

Flujo:
1. Submit → validación cliente básica (campos requeridos, formato email)
2. POST a `/api/contact` con fetch
3. Si success: mostrar mensaje de confirmación en verde
4. Si error: mostrar errores bajo cada campo

### `src/components/shared/JobApplicationForm.tsx`

Similar a ContactForm pero con:
- Select de perfil de interés
- Textarea de experiencia
- File input para CV (PDF, 5MB max) — mostrar nombre del archivo seleccionado
- Checkbox LOPD requerido
- Envío como `FormData` (multipart)

---

## Páginas a Construir

Ver `PAGES.md` para la especificación completa de componentes y UX de cada página.

Resumen de páginas:
1. `/` — Home
2. `/servicios` — Servicios detallados
3. `/digestato` — Innovación con digestato
4. `/sobre-nosotros` — Historia, misión, valores, equipo
5. `/trabaja-con-nosotros` — Captación de personal (CRÍTICO)
6. `/contacto` — Formulario + datos + mapa
7. `/admin/*` — Panel de administración (protegido)
8. `/aviso-legal`, `/privacidad`, `/cookies` — Páginas legales

---

## Implementación: Email con Nodemailer

### `src/lib/mailer.ts`

```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: import.meta.env.SMTP_HOST,
  port: Number(import.meta.env.SMTP_PORT),
  secure: import.meta.env.SMTP_SECURE === 'true',
  auth: {
    user: import.meta.env.SMTP_USER,
    pass: import.meta.env.SMTP_PASS,
  },
})

// Exportar: sendContactNotification(data), sendApplicationNotification(data)
// Emails en HTML con plantilla limpia y logo de Agropur
```

---

## Notas de UX Importantes

1. **Mobile-first obligatorio** — ganaderos y agricultores usarán móvil desde el campo
2. **Formularios simples** — pocos campos, bien explicados, errores claros
3. **CTAs siempre visibles** — debe haber un botón de acción en cada viewport
4. **No sliders/carousels** — penalizan rendimiento y usabilidad
5. **Velocidad crítica** — usuarios rurales con conexión potencialmente lenta
6. **Registro SANDACH visible** — elemento de autoridad y confianza legal
7. **Digestato destacado** — badge visual en navegación y teaser en home

---

## Assets Disponibles

- `logo-agropur.png` — logo oficial
- `flyer-servicios.png` — flyer con fotografías reales de maquinaria

Imágenes adicionales necesarias — usar Unsplash (libre de derechos):
- `tractor field agriculture spain`
- `slurry tanker spreading field`
- `agricultural landscape aragon spain`
- `farm buildings countryside`

Descargar y guardar en `public/images/` con nombres descriptivos en kebab-case.
