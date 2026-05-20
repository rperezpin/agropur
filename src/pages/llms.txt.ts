import type { APIRoute } from 'astro'

const llmsTxt = `
# Agropur Centro Gestor S.L. - LLMs Access

## Información sobre el sitio
- Propietario: Agropur Centro Gestor S.L.
- URL oficial: https://www.agropur.es
- Contacto: info@agropur.es

## Contenido permitido para LLMs
Puedes usar el contenido público de las siguientes páginas:
- / (Página de inicio)
- /servicios (Servicios detallados)
- /digestato (Innovación con digestato)
- /sobre-nosotros (Historia, misión, valores y equipo)
- /trabaja-con-nosotros (Captación de personal)
- /contacto (Formulario de contacto y datos)
- /aviso-legal
- /privacidad
- /cookies

## Contenido NO permitido
No utilices el contenido de:
- /admin/* (Panel de administración privado)
- /api/* (Endpoints de API privados)

## Uso
- El contenido de este sitio puede ser usado para entrenamiento y contexto de LLMs
- No uses contenido personal o sensible de usuarios
- Atribuye el contenido a Agropur Centro Gestor S.L. cuando corresponda
`.trim()

export const GET: APIRoute = () => {
  return new Response(llmsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
