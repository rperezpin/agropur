import { useState, useEffect } from 'preact/hooks'
import type { JSX } from 'preact'

interface FormErrors {
  [key: string]: string
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const services = [
  'Ganaderos',
  'Análisis',
  'Agricultores',
  'Gestión Administrativa',
  'Digestato',
  'Otro',
]

export default function ContactForm(): JSX.Element {
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    servicio: '',
    mensaje: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')

  // Read ?servicio= query param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const servicio = params.get('servicio')
    if (servicio) {
      setFormData((prev) => ({ ...prev, servicio }))
    }
  }, [])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email no válido'
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio'
    if (!formData.servicio) newErrors.servicio = 'Selecciona un servicio'
    if (!formData.mensaje.trim()) newErrors.mensaje = 'El mensaje es obligatorio'
    else if (formData.mensaje.trim().length < 10) newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setFormData({ nombre: '', empresa: '', email: '', telefono: '', servicio: '', mensaje: '' })
      } else {
        if (data.errors) {
          const serverErrors: FormErrors = {}
          data.errors.forEach((err: { field: string; message: string }) => {
            serverErrors[err.field] = err.message
          })
          setErrors(serverErrors)
        }
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    setFormData((prev) => ({ ...prev, [target.name]: target.value }))
    if (errors[target.name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[target.name]
        return next
      })
    }
  }

  if (status === 'success') {
    return (
      <div class="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <svg class="w-12 h-12 text-green-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-semibold text-green-800 mb-2">¡Mensaje enviado!</h3>
        <p class="text-green-700">Hemos recibido tu mensaje. Nos pondremos en contacto contigo lo antes posible.</p>
      </div>
    )
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-lg border ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    } focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary transition-colors`

  return (
    <form onSubmit={handleSubmit} noValidate class="space-y-5">
      {status === 'error' && (
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          Ha ocurrido un error. Por favor, inténtalo de nuevo.
        </div>
      )}

      <div>
        <label for="contact-nombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input id="contact-nombre" name="nombre" type="text" value={formData.nombre} onInput={handleChange} class={inputClass('nombre')} />
        {errors.nombre && <p class="text-sm text-red-600 mt-1" id="contact-nombre-error">{errors.nombre}</p>}
      </div>

      <div>
        <label for="contact-empresa" class="block text-sm font-medium text-gray-700 mb-1">Empresa <span class="text-gray-400">(opcional)</span></label>
        <input id="contact-empresa" name="empresa" type="text" value={formData.empresa} onInput={handleChange} class={inputClass('empresa')} />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="contact-email" class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input id="contact-email" name="email" type="email" value={formData.email} onInput={handleChange} class={inputClass('email')} />
          {errors.email && <p class="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label for="contact-telefono" class="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
          <input id="contact-telefono" name="telefono" type="tel" value={formData.telefono} onInput={handleChange} class={inputClass('telefono')} />
          {errors.telefono && <p class="text-sm text-red-600 mt-1">{errors.telefono}</p>}
        </div>
      </div>

      <div>
        <label for="contact-servicio" class="block text-sm font-medium text-gray-700 mb-1">Servicio de interés *</label>
        <select id="contact-servicio" name="servicio" value={formData.servicio} onChange={handleChange} class={inputClass('servicio')}>
          <option value="">Selecciona un servicio</option>
          {services.map((s) => <option value={s}>{s}</option>)}
        </select>
        {errors.servicio && <p class="text-sm text-red-600 mt-1">{errors.servicio}</p>}
      </div>

      <div>
        <label for="contact-mensaje" class="block text-sm font-medium text-gray-700 mb-1">Mensaje *</label>
        <textarea id="contact-mensaje" name="mensaje" rows={4} value={formData.mensaje} onInput={handleChange} class={inputClass('mensaje')} />
        {errors.mensaje && <p class="text-sm text-red-600 mt-1">{errors.mensaje}</p>}
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        class="w-full py-3 px-6 bg-blue-accent text-white font-semibold rounded-lg hover:bg-blue-accent/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      >
        {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
      </button>

      <p class="text-xs text-gray-400 text-center">
        Al enviar este formulario aceptas nuestra <a href="/privacidad" class="underline hover:text-gray-600">Política de Privacidad</a>.
      </p>
    </form>
  )
}
