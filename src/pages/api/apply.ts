import type { APIRoute } from 'astro'
import { z } from 'zod'
import { sendApplicationNotification } from '../../lib/mailer'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const applySchema = z.object({
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  email: z.string().email('Email no válido'),
  telefono: z.string().min(6, 'El teléfono es obligatorio'),
  perfil: z.string().min(1, 'Selecciona un perfil'),
  experiencia: z.string().optional(),
  lopd: z.string().refine((v) => v === 'true', 'Debes aceptar la política de privacidad'),
})

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData()

    const fields = {
      nombre: formData.get('nombre') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string,
      perfil: formData.get('perfil') as string,
      experiencia: formData.get('experiencia') as string || undefined,
      lopd: formData.get('lopd') as string,
    }

    const result = applySchema.safeParse(fields)

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

    // Handle CV file — read into memory, attach to email
    const cvFile = formData.get('cv') as File | null
    let cvBuffer: Buffer | undefined
    let cvFilename: string | undefined

    if (cvFile && cvFile.size > 0) {
      if (cvFile.type !== 'application/pdf') {
        return new Response(
          JSON.stringify({
            success: false,
            errors: [{ field: 'cv', message: 'El CV debe ser un archivo PDF' }],
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      if (cvFile.size > MAX_FILE_SIZE) {
        return new Response(
          JSON.stringify({
            success: false,
            errors: [{ field: 'cv', message: 'El CV no debe superar los 5MB' }],
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      const arrayBuffer = await cvFile.arrayBuffer()
      cvBuffer = Buffer.from(arrayBuffer)
      cvFilename = cvFile.name || 'curriculum.pdf'
    }

    await sendApplicationNotification({
      nombre: result.data.nombre,
      email: result.data.email,
      telefono: result.data.telefono,
      perfil: result.data.perfil,
      experiencia: result.data.experiencia,
      cvBuffer,
      cvFilename,
    })

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Apply API error:', error)
    return new Response(
      JSON.stringify({ success: false, errors: [{ field: 'general', message: 'Error interno del servidor' }] }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
