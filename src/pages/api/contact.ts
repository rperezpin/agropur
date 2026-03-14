import type { APIRoute } from 'astro'
import { z } from 'zod'
import { sendContactNotification } from '../../lib/mailer'

const contactSchema = z.object({
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  empresa: z.string().optional(),
  email: z.string().email('Email no válido'),
  telefono: z.string().min(6, 'El teléfono es obligatorio'),
  servicio: z.string().min(1, 'Selecciona un servicio'),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          errors: result.error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    await sendContactNotification(result.data)

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Contact API error:', error)
    return new Response(
      JSON.stringify({ success: false, errors: [{ field: 'general', message: 'Error interno del servidor' }] }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
