import { useState, useRef } from 'preact/hooks'
import type { JSX } from 'preact'

interface FormErrors {
  [key: string]: string
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const profiles = [
  'Operario/a de Maquinaria Agrícola',
  'Técnico/a Agronómico o Ambiental',
  'Administrativo/a con Conocimiento del Sector',
  'Perfil Junior con Ganas de Aprender',
  'Otro',
]

export default function JobApplicationForm(): JSX.Element {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    perfil: '',
    experiencia: '',
    lopd: false,
  })
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email no válido'
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio'
    if (!formData.perfil) newErrors.perfil = 'Selecciona un perfil'
    if (!formData.lopd) newErrors.lopd = 'Debes aceptar la política de privacidad'
    if (cvFile) {
      if (cvFile.type !== 'application/pdf') newErrors.cv = 'El CV debe ser un archivo PDF'
      if (cvFile.size > 5 * 1024 * 1024) newErrors.cv = 'El CV no debe superar los 5MB'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('loading')

    const fd = new FormData()
    fd.append('nombre', formData.nombre)
    fd.append('email', formData.email)
    fd.append('telefono', formData.telefono)
    fd.append('perfil', formData.perfil)
    fd.append('experiencia', formData.experiencia)
    fd.append('lopd', formData.lopd ? 'true' : 'false')
    if (cvFile) fd.append('cv', cvFile)

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setFormData({ nombre: '', email: '', telefono: '', perfil: '', experiencia: '', lopd: false })
        setCvFile(null)
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
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value
    setFormData((prev) => ({ ...prev, [target.name]: value }))
    if (errors[target.name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[target.name]
        return next
      })
    }
  }

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0] || null
    setCvFile(file)
    if (errors.cv) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.cv
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
        <h3 class="text-lg font-semibold text-green-800 mb-2">¡Candidatura enviada!</h3>
        <p class="text-green-700">Hemos recibido tu candidatura. Nos pondremos en contacto contigo en breve.</p>
      </div>
    )
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-lg border ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    } focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary transition-colors`

  return (
    <form onSubmit={handleSubmit} noValidate class="space-y-5 bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-200">
      {status === 'error' && (
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          Ha ocurrido un error. Por favor, inténtalo de nuevo.
        </div>
      )}

      <div>
        <label for="apply-nombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
        <input id="apply-nombre" name="nombre" type="text" value={formData.nombre} onInput={handleChange} class={inputClass('nombre')} />
        {errors.nombre && <p class="text-sm text-red-600 mt-1">{errors.nombre}</p>}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="apply-email" class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input id="apply-email" name="email" type="email" value={formData.email} onInput={handleChange} class={inputClass('email')} />
          {errors.email && <p class="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label for="apply-telefono" class="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
          <input id="apply-telefono" name="telefono" type="tel" value={formData.telefono} onInput={handleChange} class={inputClass('telefono')} />
          {errors.telefono && <p class="text-sm text-red-600 mt-1">{errors.telefono}</p>}
        </div>
      </div>

      <div>
        <label for="apply-perfil" class="block text-sm font-medium text-gray-700 mb-1">Perfil de interés *</label>
        <select id="apply-perfil" name="perfil" value={formData.perfil} onChange={handleChange} class={inputClass('perfil')}>
          <option value="">Selecciona un perfil</option>
          {profiles.map((p) => <option value={p}>{p}</option>)}
        </select>
        {errors.perfil && <p class="text-sm text-red-600 mt-1">{errors.perfil}</p>}
      </div>

      <div>
        <label for="apply-experiencia" class="block text-sm font-medium text-gray-700 mb-1">Experiencia <span class="text-gray-400">(opcional)</span></label>
        <textarea id="apply-experiencia" name="experiencia" rows={3} value={formData.experiencia} onInput={handleChange} class={inputClass('experiencia')} placeholder="Cuéntanos brevemente tu experiencia o motivación" />
      </div>

      <div>
        <label for="apply-cv" class="block text-sm font-medium text-gray-700 mb-1">CV (PDF, máx. 5MB)</label>
        <div class="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            class="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors"
          >
            Seleccionar archivo
          </button>
          <span class="text-sm text-gray-500 truncate flex-1">
            {cvFile ? cvFile.name : 'Ningún archivo seleccionado'}
          </span>
        </div>
        <input
          ref={fileInputRef}
          id="apply-cv"
          name="cv"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          class="hidden"
        />
        {errors.cv && <p class="text-sm text-red-600 mt-1">{errors.cv}</p>}
      </div>

      <div class="flex items-start gap-3">
        <input
          id="apply-lopd"
          name="lopd"
          type="checkbox"
          checked={formData.lopd}
          onChange={handleChange}
          class="mt-1 w-4 h-4 text-green-primary rounded border-gray-300 focus:ring-green-primary/50"
        />
        <label for="apply-lopd" class="text-sm text-gray-600">
          He leído y acepto la <a href="/privacidad" class="text-green-primary underline hover:text-green-primary/80" target="_blank">Política de Privacidad</a> y el tratamiento de mis datos personales. *
        </label>
      </div>
      {errors.lopd && <p class="text-sm text-red-600">{errors.lopd}</p>}

      <button
        type="submit"
        disabled={status === 'loading'}
        class="w-full py-3 px-6 bg-blue-accent text-white font-semibold rounded-lg hover:bg-blue-accent/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      >
        {status === 'loading' ? 'Enviando...' : 'Enviar candidatura'}
      </button>
    </form>
  )
}
