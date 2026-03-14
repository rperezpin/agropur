import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, l as renderSlot } from './astro/server_D22Xuz0b.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from './BaseLayout_18kxNXDN.mjs';

const $$Astro = createAstro("https://www.agropur.es");
const $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLayout;
  const { title } = Astro2.props;
  const currentPath = Astro2.url.pathname;
  const navItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Contactos", href: "/admin/contactos" },
    { label: "Candidaturas", href: "/admin/candidaturas" }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${title} | Admin Agropur`, "description": "Panel de administraci\xF3n" }, { "default": ($$result2) => renderTemplate`   ${maybeRenderHead()}<div class="min-h-screen flex bg-gray-100"> <!-- Sidebar --> <aside class="w-64 bg-gray-dark text-white flex-shrink-0"> <div class="p-6"> <a href="/admin" class="flex items-center gap-3"> <img src="/logo-agropur.jpeg" alt="Agropur" class="w-10 h-10 rounded"> <span class="font-heading font-bold text-lg">Admin</span> </a> </div> <nav class="mt-4"> ${navItems.map((item) => renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute([
    "block px-6 py-3 text-sm transition-colors duration-200",
    currentPath === item.href ? "bg-green-primary text-white font-medium" : "text-gray-300 hover:bg-gray-700 hover:text-white"
  ], "class:list")}> ${item.label} </a>`)} <hr class="border-gray-600 my-4 mx-6"> <form action="/api/admin/logout" method="POST"> <button type="submit" class="block w-full text-left px-6 py-3 text-sm text-gray-300 hover:bg-red-700 hover:text-white transition-colors duration-200">
Cerrar sesión
</button> </form> </nav> </aside> <!-- Main content --> <div class="flex-1 p-8"> <h1 class="text-2xl font-heading font-bold text-black-soft mb-6">${title}</h1> ${renderSlot($$result2, $$slots["default"])} </div> </div> `, "footer": ($$result2) => renderTemplate`<div></div>`, "header": ($$result2) => renderTemplate`<div></div>` })}`;
}, "/home/ruben/Proyectos/agropur/src/layouts/AdminLayout.astro", void 0);

export { $$AdminLayout as $ };
