/* empty css                                           */
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_D22Xuz0b.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DI6HcKHJ.mjs';
export { renderers } from '../../renderers.mjs';

const $$Candidaturas = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Candidaturas" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-white rounded-xl p-8 border border-gray-200 text-center"> <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 mb-4"> <svg class="w-7 h-7 text-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"> <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path> </svg> </div> <h2 class="font-heading font-semibold text-xl text-gray-dark mb-2">Candidaturas</h2> <p class="text-gray-mid text-sm max-w-sm mx-auto">
Cada candidatura se reenvía automáticamente a <strong>rrhh@agropur.es</strong> mediante Brevo, con el CV adjunto en PDF si el candidato lo ha proporcionado.
</p> </div> ` })}`;
}, "/home/ruben/Proyectos/agropur/src/pages/admin/candidaturas.astro", void 0);

const $$file = "/home/ruben/Proyectos/agropur/src/pages/admin/candidaturas.astro";
const $$url = "/admin/candidaturas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Candidaturas,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
