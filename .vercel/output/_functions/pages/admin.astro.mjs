/* empty css                                        */
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D22Xuz0b.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../chunks/AdminLayout_DI6HcKHJ.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Dashboard" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-white rounded-xl p-8 border border-gray-200 text-center"> <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 mb-4"> <svg class="w-7 h-7 text-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"> <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path> </svg> </div> <h2 class="font-heading font-semibold text-xl text-gray-dark mb-2">Todo llega por email</h2> <p class="text-gray-mid text-sm max-w-sm mx-auto">
Los mensajes de contacto se envían a <strong>info@agropur.es</strong> y las candidaturas a <strong>rrhh@agropur.es</strong> en tiempo real a través de Brevo.
</p> </div> ` })}`;
}, "/home/ruben/Proyectos/agropur/src/pages/admin/index.astro", void 0);

const $$file = "/home/ruben/Proyectos/agropur/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
