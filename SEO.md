# SEO.md — Estrategia SEO para Astro

## Implementación en Astro

En cada página pública, usar `generateMetadata` nativo de Astro vía las props del layout:

```astro
---
// En cada página .astro
const title = "Título de la página | Agropur Centro Gestor"
const description = "Descripción de 150-160 caracteres."
---
<BaseLayout title={title} description={description}>
```

En `BaseLayout.astro`, el `<head>` debe incluir:

```astro
<!-- SEO básico -->
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={new URL(Astro.url.pathname, site).href} />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:locale" content="es_ES" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={Astro.url.href} />
<meta property="og:site_name" content="Agropur Centro Gestor S.L." />
<meta property="og:image" content="/og-image.jpg" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
```

---

## Metadatos por Página

### Home (`/`)
```
title:       "Agropur Centro Gestor S.L. | Gestión Integral de Purines en Aragón y Navarra"
description: "Empresa especializada en gestión colectiva de purines, digestato y deyecciones porcinas en Hoya de Huesca, Cinco Villas y Rivera Alta de Navarra. Registro SANDACH ESP22125010."
```

### Servicios (`/servicios`)
```
title:       "Servicios de Gestión de Purines | Agropur Centro Gestor"
description: "Servicio para ganaderos y agricultores: análisis NPK, transporte granja-agricultor, tubos colgantes, gestión administrativa y cumplimiento SANDACH."
```

### Digestato (`/digestato`)
```
title:       "Digestato de Purín: Fertilización Orgánica Avanzada | Agropur"
description: "Agropur es pionera en el trabajo con digestato de purín en Aragón. Ventajas frente al purín convencional, impacto medioambiental y cómo beneficiarte."
```

### Sobre Nosotros (`/sobre-nosotros`)
```
title:       "Sobre Nosotros | Agropur Centro Gestor S.L. desde 2016"
description: "Empresa de gestión de purines con sede en Ejea de los Caballeros (Zaragoza). Experiencia desde 2016, registro SANDACH y cobertura en 3 comarcas."
```

### Trabaja con Nosotros (`/trabaja-con-nosotros`)
```
title:       "Trabaja con Nosotros | Empleo en Gestión Agrícola | Agropur"
description: "Agropur está creciendo y busca operarios de maquinaria, técnicos agronómicos y perfiles administrativos en Aragón y Navarra. Empresa estable con trabajo real."
```

### Contacto (`/contacto`)
```
title:       "Contacto | Agropur Centro Gestor S.L. — Ejea de los Caballeros"
description: "Contacta con Agropur para gestión de purines, digestato y servicios agronómicos en Aragón y Navarra."
```

---

## Schema.org JSON-LD

Añadir en `BaseLayout.astro` de forma condicional, o en cada página directamente:

### En Home — LocalBusiness
```json
{
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "name": "Agropur Centro Gestor S.L.",
  "description": "Gestión colectiva de purines y digestato en Aragón y Navarra",
  "url": "https://www.agropur.es",
  "logo": "https://www.agropur.es/logo-agropur.png",
  "image": "https://www.agropur.es/og-image.jpg",
  "foundingDate": "2016",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Ejea de los Caballeros",
    "addressRegion": "Zaragoza",
    "addressCountry": "ES"
  },
  "areaServed": ["Hoya de Huesca", "Cinco Villas", "Rivera Alta de Navarra"],
  "sameAs": ["https://www.linkedin.com/company/agropur-centro-gestor-s-l-"]
}
```

### En Trabaja con Nosotros — JobPosting
```json
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Operario/a de Maquinaria Agrícola",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Agropur Centro Gestor S.L.",
    "sameAs": "https://www.agropur.es"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ejea de los Caballeros",
      "addressRegion": "Zaragoza",
      "addressCountry": "ES"
    }
  },
  "employmentType": "FULL_TIME",
  "description": "Búsqueda continua de operarios/as para gestión de maquinaria agrícola."
}
```

---

## Sitemap y Robots

### `src/pages/robots.txt.ts`
```typescript
export async function GET() {
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://www.agropur.es/sitemap-index.xml`,
    { headers: { 'Content-Type': 'text/plain' } }
  )
}
```

### Sitemap automático
Usar integración oficial: `npx astro add sitemap`

```js
// astro.config.mjs
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://www.agropur.es',
  integrations: [sitemap({
    filter: (page) => !page.includes('/admin') && !page.includes('/api'),
  })],
})
```

---

## Keywords Objetivo

### Transaccionales (contratar)
- `gestión purines Zaragoza`
- `gestión purines Huesca`
- `empresa gestión purines Aragón`
- `transporte purines Cinco Villas`
- `gestión colectiva purines Navarra`
- `gestión deyecciones porcinas Aragón`

### Informacionales (digestato — baja competencia, alta oportunidad)
- `qué es el digestato de purín`
- `digestato purín fertilizante`
- `ventajas digestato vs purín`
- `análisis NPK purín`
- `normativa SANDACH España`

### Long-tail laborales
- `trabajo maquinaria agrícola Zaragoza`
- `empleo técnico agronómico Aragón`
- `trabajo sector ganadero Cinco Villas`

---

## Imagen OG (`public/og-image.jpg`)

- Tamaño: 1200×630px
- Contenido: logo Agropur + fondo campo + texto "Gestión integral de purines · Aragón y Navarra"
- Formato: JPG optimizado < 200KB
- Se ve cuando se comparte el enlace en LinkedIn, WhatsApp o Twitter

---

## Estrategia de Contenido Futuro (post-lanzamiento)

1. **Google Business Profile** — dar de alta con fotos, horarios, categoría
2. **Blog `/blog`** — artículos SEO sobre: normativa SANDACH, digestato vs purín, plan de fertilización
3. **LinkedIn** — publicar actualizaciones del sector (ya tienen página activa)
4. **Backlinks** — asociaciones agrarias de Aragón y Navarra, organismos medioambientales
