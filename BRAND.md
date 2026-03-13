# BRAND.md — Identidad Visual y Tono de Comunicación

## Personalidad de Marca

Agropur debe proyectar:
- **Confianza** — empresa establecida desde 2016 con registro oficial
- **Profesionalidad técnica** — no solo agricultores, también gestores y técnicos
- **Proximidad** — empresa local que conoce el territorio y a sus clientes
- **Innovación responsable** — adoptamos nuevas tecnologías (digestato) con rigor
- **Compromiso medioambiental** — la gestión correcta de purines protege el medio ambiente

---

## Paleta de Colores

### Colores Principales (extraídos del logo y flyer)

```css
--color-green-primary: #4a7c3f;      /* Verde oscuro — naturaleza, confianza, campo */
--color-green-mid:     #6aab5e;      /* Verde medio — botones secundarios, accents */
--color-orange-accent: #c8631a;      /* Naranja/teja — del logo, CTAs principales */
--color-brown-earth:   #7a4f28;      /* Marrón tierra — detalles, bordes */
```

### Colores Neutros

```css
--color-white:      #ffffff;
--color-gray-light: #f4f6f3;         /* Fondo de secciones alternas */
--color-gray-mid:   #6b7280;         /* Texto secundario */
--color-gray-dark:  #1f2937;         /* Texto principal */
--color-black-soft: #111827;         /* Títulos principales */
```

### Color Especial — Digestato (Novedad)

```css
--color-innovation:    #16a34a;      /* Verde brillante para badge NOVEDAD */
--color-innovation-bg: #dcfce7;      /* Fondo sutil para sección digestato */
```

### Definición en `tailwind.config.mjs`

```js
theme: {
  extend: {
    colors: {
      'green-primary':    '#4a7c3f',
      'green-mid':        '#6aab5e',
      'orange-accent':    '#c8631a',
      'brown-earth':      '#7a4f28',
      'gray-brand':       '#f4f6f3',
      'innovation':       '#16a34a',
      'innovation-light': '#dcfce7',
    }
  }
}
```

### Tabla de Uso

| Elemento | Color |
|---|---|
| Botón CTA principal | `orange-accent` (#c8631a) hover más oscuro |
| Botón CTA secundario | `green-primary` outlined |
| H1 | `black-soft` |
| H2 de sección | `green-primary` |
| Texto body | `gray-dark` |
| Fondo sección par | `white` |
| Fondo sección impar | `gray-brand` |
| Badge NOVEDAD Digestato | texto `innovation` sobre `innovation-light` |
| Footer fondo | `gray-dark` texto claro |

---

## Tipografía

### Fuentes (Google Fonts)

```html
<!-- En BaseLayout.astro <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
```

- **Títulos H1–H3:** `Raleway` semibold 600/700 — moderno y profesional
- **Body y listas:** `Inter` regular 400, medium 500 — máxima legibilidad

### Escala Tipográfica Tailwind

| Elemento | Clase Tailwind |
|---|---|
| H1 Hero | `text-5xl font-bold` (48px) |
| H2 Sección | `text-3xl font-semibold` (30px) |
| H3 Subsección | `text-xl font-semibold` (20px) |
| Body | `text-base font-normal` (16px) |
| Caption/small | `text-sm` (14px) |

```css
/* global.css */
h1, h2, h3 { font-family: 'Raleway', sans-serif; }
body        { font-family: 'Inter', sans-serif; }
```

---

## Estilo Visual General

### Fotografía
- **Real y auténtica**: maquinaria de Agropur, campos reales
- Tonos cálidos, luz natural, paisaje agrícola español
- Formato 16:9 para heroes, 1:1 para tarjetas de equipo
- Fuente de imágenes adicionales: Unsplash (libre de derechos)

### Iconografía
- Estilo: **outline limpio** — Heroicons o Lucide
- 24px inline, 48px en tarjetas de servicios
- Color: `green-primary` por defecto, `orange-accent` para CTAs

### Espaciado
- Max-width contenido: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Padding secciones: `py-16` desktop, `py-10` móvil
- Gap entre tarjetas: `gap-6` o `gap-8`

### Efectos y Animaciones
- Aparición al scroll: **AOS** (fade-up, 300ms duration)
- Hover en tarjetas: `hover:shadow-lg hover:scale-[1.02] transition-all duration-200`
- Transiciones de color/fondo: `transition-colors duration-200`
- **Sin** parallax, sin efectos excesivos — la web es para profesionales del sector primario

---

## Tono de Comunicación

### Voz de Marca
- **Clara y directa** — sin tecnicismos innecesarios, con rigor cuando importa
- **Cercana pero profesional** — trato de tú, pero con seriedad
- **Propositiva** — enfocada en soluciones y beneficios
- **Honesta** — "tenemos trabajo y necesitamos personas" es honesto y atractivo

### Ejemplos

❌ Evitar:
> "Somos líderes mundiales en soluciones integrales de gestión de residuos ganaderos"

✅ Usar:
> "Gestionamos los purines de tu granja de forma eficiente, legal y sostenible — desde 2016."

❌ Evitar:
> "Buscamos candidatos con experiencia acreditada en maquinaria de alto rendimiento"

✅ Usar:
> "Tenemos trabajo. Si tienes ganas de aprender y trabajar en el campo, queremos hablar contigo."

---

## Tratamiento Visual del Digestato

El digestato es el **elemento diferenciador** y debe tratarse como una innovación de primer nivel:

- Badge en navegación: punto verde animado + texto `NUEVO` en pequeño
- Color propio: `innovation` (#16a34a)
- Sección teaser en home con fondo `innovation-light`
- Página propia `/digestato` con badge `PIONEROS EN EL SECTOR`
- Tabla comparativa: columna Digestato con fondo verde suave

**Mensaje clave:**
> "Mientras otros gestionan purín, nosotros ya trabajamos con digestato. El futuro de la fertilización orgánica está aquí."
