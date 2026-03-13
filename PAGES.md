# PAGES.md — Especificación de Páginas y Componentes (Astro)

## Convenciones Astro

- Componentes `.astro` para todo lo estático
- Islas `.tsx` (Preact) solo para lógica de cliente (formularios, menú mobile)
- `client:load` para islas visibles al cargar; `client:visible` para below-the-fold
- Cada página pública: `export const prerender = true` en la primera línea

---

## BaseLayout.astro

```astro
---
// Props: title, description, ogImage?
---
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <!-- Open Graph, canonical, fuentes Google, AOS CSS -->
</head>
<body>
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
  <!-- AOS JS init al final del body -->
</body>
</html>
```

---

## Página: Home (`/index.astro`)

```
prerender: true

Secciones:
1. Hero
2. StatsBar          ← fondo orange-accent
3. ServicesGrid      ← fondo white
4. DigestatoTeaser   ← fondo innovation-light
5. WhyAgropur        ← fondo white
6. GeographyBlock    ← fondo gray-brand
7. HomeCTA           ← fondo green-primary
```

### Hero
- Imagen de fondo con overlay oscuro (campo + maquinaria)
- Badge opcional: "✦ Ahora: Digestato de purín"
- H1 + párrafo intro
- Dos botones: primario (orange-accent) + secundario (outlined blanco)
- Altura: `min-h-[85vh]` desktop

### StatsBar
- Fondo orange-accent, texto blanco
- 4 métricas en `grid grid-cols-2 md:grid-cols-4`
- Número grande + label pequeño debajo

### ServicesGrid
- H2 centrado + subtítulo
- Grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`
- Tarjeta: icono 48px + título H3 + descripción + link con flecha
- Hover: `hover:shadow-lg hover:scale-[1.02] transition-all`

### DigestatoTeaser
- Fondo `innovation-light`, borde top `innovation`
- Layout: `grid grid-cols-1 md:grid-cols-2 gap-8 items-center`
- Badge pill verde + H2 + párrafo + botón

### WhyAgropur
- H2 centrado
- Grid `grid-cols-1 sm:grid-cols-2 gap-8`
- Cada item: icono Heroicon + título bold + texto

### GeographyBlock
- Layout 2 cols: lista de comarcas + imagen/mapa
- Lista con íconos de ubicación

### HomeCTA
- Fondo green-primary, texto blanco
- H2 grande centrado + párrafo + botón blanco

---

## Página: Servicios (`/servicios.astro`)

```
prerender: true
```

### PageHero (componente compartido)
```astro
---
// Props: title, subtitle, backgroundImage?
---
```
- Altura `min-h-[40vh]`
- Breadcrumb: `Inicio > Servicios`

### ServicesIntro
- Texto + diagrama SVG del ciclo (Granja → Análisis → Transporte → Campo → Asesoramiento)
- El SVG debe estar inline en el componente para poder animarlo con AOS/CSS

### ServiceDetail (×4, componente reutilizable)
```astro
---
// Props: title, icon, description, features: string[], image?, reverse?: boolean
---
```
- Layout `grid grid-cols-1 md:grid-cols-2 gap-12 items-center`
- `reverse` prop alterna imagen izquierda/derecha en desktop
- Lista con icono check en color green-primary
- Secciones impares con fondo gray-brand

---

## Página: Digestato (`/digestato.astro`)

```
prerender: true
```

### DigestatoHero
- Badge "Pioneros en el sector" + H1 + párrafo intro

### WhatIsDigestate
- 2 cols: explicación + imagen ilustrativa

### ComparisonTable
- Tabla responsiva con `overflow-x-auto`
- En mobile: cada fila legible en scroll horizontal
- Columna Digestato: fondo `innovation-light/50`
- Header de tabla: fondo green-primary, texto blanco

### WhyAgropurDigestate
- 3 bloques de texto con icono

### EnvironmentalImpact
- Fondo innovation-light
- 3 iconos en fila: `grid-cols-1 sm:grid-cols-3`

### DigestatoCTA
- Fondo green-primary
- Botón hacia `/contacto?servicio=digestato` (preselecciona el servicio en el form)

---

## Página: Sobre Nosotros (`/sobre-nosotros.astro`)

```
prerender: true
```

### OurStory
- 2 cols: texto historia + imagen del equipo/maquinaria

### MissionVisionValues
- 3 tarjetas en `grid-cols-1 md:grid-cols-3`
- Icono grande + título + texto
- Tarjeta con borde top de color (verde, naranja, marrón respectivamente)

### GeographicCoverage
- Mapa estático o SVG de la zona
- Lista de 3 comarcas con descripción breve

### Certifications
- Caja destacada (borde verde, fondo blanco)
- SANDACH ESP22125010 en texto grande
- Párrafo explicativo de qué es SANDACH

---

## Página: Trabaja con Nosotros (`/trabaja-con-nosotros.astro`)

```
prerender: true
```

> Esta página tiene tono diferente: más humano, más directo, menos corporativo.

### JobsHero
- Headline impactante: "Tenemos trabajo. Necesitamos personas."
- Subheadline honesto
- Scroll suave hacia perfiles: `<a href="#perfiles">`

### WhyJoinAgropur
- 5 tarjetas en grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- "Trabajo real y estable" destacado visualmente (borde o fondo diferente)

### OpenProfiles (id="perfiles")
- 4 tarjetas `grid-cols-1 md:grid-cols-2`
- Cada tarjeta: icono de perfil + título + descripción + botón "Me interesa →" (ancla al form)
- "Perfil Junior" con badge especial para atraer candidatos sin experiencia

### SelectionProcess
- 3 pasos en `flex` horizontal con números grandes circulares
- En mobile: columna vertical con línea conectora

### JobApplicationForm (isla Preact)
```tsx
client:visible
// Campos: nombre, email, tel, perfil (select), experiencia (textarea),
// cv (file input PDF), lopd (checkbox)
// POST a /api/apply como FormData
// Estados: idle → loading → success/error
```

### JobsClosing
- Párrafo motivador final
- "¿No encajas en ningún perfil? Escríbenos igualmente."

---

## Página: Contacto (`/contacto.astro`)

```
prerender: true
```

### ContactSplit
- `grid grid-cols-1 lg:grid-cols-2 gap-12`
- Col izquierda: ContactForm (isla Preact)
- Col derecha: datos de contacto + mapa

### ContactForm (isla Preact)
```tsx
client:load
// Campos: nombre, empresa (opcional), email, tel, servicio (select), mensaje
// POST a /api/contact como JSON
// Leer query param ?servicio= para preseleccionar
```

### ContactInfo
- Icono + dato para: dirección, email, teléfono, horario
- Mapa: iframe Google Maps o `<iframe>` de OpenStreetMap (sin API key)

---

## Panel Admin (`/admin/*.astro`)

> Las páginas admin son SSR puro — sin prerender.
> Protegidas por `middleware.ts`.

### AdminLayout.astro
- Sidebar fijo con: logo reducido | Dashboard | Contactos | Candidaturas | — | Cerrar sesión
- Main content area
- Estilo: limpio y funcional — Tailwind puro, sin librerías UI

### `/admin/login.astro`
- Página standalone (sin AdminLayout)
- Formulario simple centrado en pantalla
- POST a `/api/admin/login`
- Si `?error=1` → mostrar alerta de credenciales incorrectas

### `/admin/index.astro`
- 4 metric cards: Total contactos | No leídos | Total candidaturas | No leídas
- Links rápidos a secciones

### `/admin/contactos.astro`
- Tabla: fecha | nombre | empresa | email | tel | servicio | mensaje (truncado) | estado
- Click en fila → modal o expand con mensaje completo
- Botón "Marcar leído" → POST a `/api/admin/mark-read?table=contacts&id=X`
- Filtro: Todos | No leídos
- Paginación simple (25 por página)

### `/admin/candidaturas.astro`
- Tabla: fecha | nombre | email | tel | perfil | resumen | CV | estado
- Enlace descarga CV → `/api/admin/cv?id=X` (endpoint protegido que sirve el fichero)
- Botón "Marcar leído"
- Filtro por perfil

---

## Páginas Legales

Generar con contenido base RGPD/LOPDGDD español:

- `/aviso-legal.astro` — razón social, CIF, registro mercantil, condiciones de uso
- `/privacidad.astro` — responsable del tratamiento, finalidades, derechos ARCO
- `/cookies.astro` — tipos de cookies, cómo gestionarlas (banner de cookies recomendado: `vanilla-cookieconsent`)

---

## Responsive Breakpoints

```
sm:  640px   Tablets pequeñas
md:  768px   Tablets
lg:  1024px  Desktop pequeño
xl:  1280px  Desktop
```

Max-width contenido: `max-w-7xl` (1280px) con padding horizontal.

---

## Accesibilidad — Checklist por Página

- `<h1>` único y descriptivo en cada página
- Imágenes de contenido: `alt` en español, descriptivo
- Imágenes decorativas: `alt=""`
- Formularios: `<label>` con `for` vinculado a cada `id` de input
- Errores: `aria-describedby` apuntando al mensaje de error
- Focus visible en todos los elementos interactivos
- Contraste WCAG AA mínimo (verificar con WebAIM Contrast Checker)
- Menú mobile accesible con `aria-expanded` y gestión de foco
