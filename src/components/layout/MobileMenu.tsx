import { useState, useEffect, useRef } from 'preact/hooks'
import type { JSX } from 'preact'

interface NavItem {
  label: string
  href: string
  badge: boolean
}

interface Props {
  navItems: NavItem[]
  currentPath: string
}

export default function MobileMenu({ navItems, currentPath }: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <>
      {/* Hamburger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        class="p-2 rounded-md text-gray-dark hover:bg-gray-brand transition-colors"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          {isOpen ? (
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          class="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Menu Panel */}
      <div
        ref={menuRef}
        id="mobile-menu"
        class={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        {/* Close button */}
        <div class="flex justify-end p-4">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú"
            class="p-2 rounded-md text-gray-dark hover:bg-gray-brand transition-colors"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <nav class="px-4 space-y-1" aria-label="Menú móvil">
          {navItems.map((item) => (
            <a
              href={item.href}
              class={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                currentPath === item.href
                  ? 'text-green-primary bg-green-primary/10'
                  : 'text-gray-dark hover:text-green-primary hover:bg-gray-brand'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
              {item.badge && (
                <span class="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-innovation-light text-innovation uppercase">
                  <span class="w-1.5 h-1.5 rounded-full bg-innovation animate-pulse" />
                  Nuevo
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div class="px-4 mt-6">
          <a
            href="/contacto"
            class="block w-full text-center px-5 py-3 bg-blue-accent text-white font-semibold rounded-lg hover:bg-blue-accent/90 transition-colors shadow-sm"
            onClick={() => setIsOpen(false)}
          >
            Solicitar información
          </a>
        </div>
      </div>
    </>
  )
}
