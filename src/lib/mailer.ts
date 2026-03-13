import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: import.meta.env.SMTP_HOST || 'localhost',
  port: Number(import.meta.env.SMTP_PORT) || 465,
  secure: import.meta.env.SMTP_SECURE === 'true',
  auth: {
    user: import.meta.env.SMTP_USER,
    pass: import.meta.env.SMTP_PASS,
  },
})

const CONTACT_EMAIL = import.meta.env.CONTACT_EMAIL || 'info@agropur.es'
const JOB_EMAIL = import.meta.env.JOB_EMAIL || 'rrhh@agropur.es'
const FROM_EMAIL = import.meta.env.SMTP_USER || 'info@agropur.es'

function baseTemplate(title: string, content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"></head>
    <body style="font-family: 'Inter', Arial, sans-serif; background: #f4f6f3; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background: #4a7c3f; padding: 20px 30px; text-align: center;">
          <h1 style="color: white; font-size: 20px; margin: 0;">Agropur Centro Gestor</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1f2937; font-size: 18px; margin-top: 0;">${title}</h2>
          ${content}
        </div>
        <div style="background: #f4f6f3; padding: 15px 30px; text-align: center; font-size: 12px; color: #6b7280;">
          Agropur Centro Gestor S.L. — Este email ha sido generado automáticamente.
        </div>
      </div>
    </body>
    </html>
  `
}

export interface ContactEmailData {
  nombre: string
  empresa?: string
  email: string
  telefono: string
  servicio: string
  mensaje: string
}

export async function sendContactNotification(data: ContactEmailData): Promise<void> {
  const content = `
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #6b7280; width: 120px;"><strong>Nombre:</strong></td><td style="padding: 8px 0;">${data.nombre}</td></tr>
      ${data.empresa ? `<tr><td style="padding: 8px 0; color: #6b7280;"><strong>Empresa:</strong></td><td style="padding: 8px 0;">${data.empresa}</td></tr>` : ''}
      <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Teléfono:</strong></td><td style="padding: 8px 0;"><a href="tel:${data.telefono}">${data.telefono}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Servicio:</strong></td><td style="padding: 8px 0;">${data.servicio}</td></tr>
    </table>
    <div style="margin-top: 16px; padding: 16px; background: #f4f6f3; border-radius: 8px;">
      <strong style="color: #6b7280;">Mensaje:</strong>
      <p style="margin: 8px 0 0; white-space: pre-wrap;">${data.mensaje}</p>
    </div>
  `

  await transporter.sendMail({
    from: `"Web Agropur" <${FROM_EMAIL}>`,
    to: CONTACT_EMAIL,
    subject: `Nuevo contacto web: ${data.nombre} — ${data.servicio}`,
    html: baseTemplate('Nuevo mensaje de contacto', content),
  })
}

export interface ApplicationEmailData {
  nombre: string
  email: string
  telefono: string
  perfil: string
  experiencia?: string
}

export async function sendApplicationNotification(data: ApplicationEmailData): Promise<void> {
  const content = `
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #6b7280; width: 120px;"><strong>Nombre:</strong></td><td style="padding: 8px 0;">${data.nombre}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Teléfono:</strong></td><td style="padding: 8px 0;"><a href="tel:${data.telefono}">${data.telefono}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Perfil:</strong></td><td style="padding: 8px 0;">${data.perfil}</td></tr>
    </table>
    ${data.experiencia ? `
    <div style="margin-top: 16px; padding: 16px; background: #f4f6f3; border-radius: 8px;">
      <strong style="color: #6b7280;">Experiencia:</strong>
      <p style="margin: 8px 0 0; white-space: pre-wrap;">${data.experiencia}</p>
    </div>
    ` : ''}
    <p style="margin-top: 16px; color: #6b7280; font-size: 14px;">
      El CV se ha guardado en el servidor. Accede al panel de administración para descargarlo.
    </p>
  `

  await transporter.sendMail({
    from: `"Web Agropur" <${FROM_EMAIL}>`,
    to: JOB_EMAIL,
    subject: `Nueva candidatura: ${data.nombre} — ${data.perfil}`,
    html: baseTemplate('Nueva candidatura recibida', content),
  })
}
