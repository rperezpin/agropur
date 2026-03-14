/* empty css                                           */
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_D22Xuz0b.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DI6HcKHJ.mjs';
export { renderers } from '../../renderers.mjs';

const $$Contactos = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Contactos" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-white rounded-xl p-8 border border-gray-200 text-center"> <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mb-4"> <svg class="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"> <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path> </svg> </div> <h2 class="font-heading font-semibold text-xl text-gray-dark mb-2">Mensajes de contacto</h2> <p class="text-gray-mid text-sm max-w-sm mx-auto">
Cada mensaje del formulario web se reenvía automáticamente a <strong>info@agropur.es</strong> mediante Brevo.
</p> </div> ` })}`;
}, "/home/ruben/Proyectos/agropur/src/pages/admin/contactos.astro", void 0);

const $$file = "/home/ruben/Proyectos/agropur/src/pages/admin/contactos.astro";
const $$url = "/admin/contactos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contactos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
