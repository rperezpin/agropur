import { useState, useEffect } from 'preact/hooks'
import type { JSX } from 'preact'

export default function CookieBanner(): JSX.Element {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('agropur_cookie_consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem('agropur_cookie_consent', 'accepted')
    setShowBanner(false)
    
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: 'cookie_consent_given' })
    }
  }

  const acceptNecessary = () => {
    localStorage.setItem('agropur_cookie_consent', 'necessary')
    setShowBanner(false)
    
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: 'cookie_consent_necessary' })
    }
  }

  if (!showBanner) return <></>

  return (
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4 md:p-6">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <div class="flex-1">
          <p class="text-sm text-gray-700">
            Utilizamos cookies necesarias para el funcionamiento del sitio y cookies analíticas a través de Google Tag Manager para mejorar tu experiencia. 
            Puedes aceptar todas o solo las necesarias.
          </p>
          <a href="/cookies" class="text-sm text-green-primary underline hover:text-green-primary/80 mt-2 inline-block">
            Ver política de cookies
          </a>
        </div>
        <div class="flex gap-3 w-full md:w-auto">
          <button 
            onClick={acceptNecessary}
            class="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Solo necesarias
          </button>
          <button 
            onClick={acceptAll}
            class="flex-1 md:flex-none px-4 py-2 bg-green-primary text-white rounded-lg hover:bg-green-primary/90 transition-colors text-sm font-medium"
          >
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  )
}
