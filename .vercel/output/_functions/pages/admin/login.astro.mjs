/* empty css                                           */
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_D22Xuz0b.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_18kxNXDN.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://www.agropur.es");
const $$Login = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const title = "Login | Admin Agropur";
  const error = Astro2.url.searchParams.get("error");
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": "Panel de administraci\xF3n - Login" }, { "default": ($$result2) => renderTemplate`   ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center bg-gray-100 px-4"> <div class="w-full max-w-md"> <div class="text-center mb-8"> <img src="/logo-agropur.jpeg" alt="Agropur" class="h-16 mx-auto mb-4 rounded-lg"> <h1 class="text-2xl font-heading font-bold text-gray-dark">Panel de Administración</h1> <p class="text-gray-mid text-sm mt-1">Accede con tus credenciales</p> </div> ${error && renderTemplate`<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700 text-center">
Credenciales incorrectas. Inténtalo de nuevo.
</div>`} <form action="/api/admin/login" method="POST" class="bg-white rounded-xl shadow-sm p-8 border border-gray-200"> <div class="space-y-5"> <div> <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Usuario</label> <input id="username" name="username" type="text" required autocomplete="username" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary transition-colors"> </div> <div> <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label> <input id="password" name="password" type="password" required autocomplete="current-password" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary transition-colors"> </div> <button type="submit" class="w-full py-3 px-6 bg-green-primary text-white font-semibold rounded-lg hover:bg-green-primary/90 transition-colors shadow-sm">
Iniciar sesión
</button> </div> </form> <p class="text-center mt-6"> <a href="/" class="text-sm text-gray-mid hover:text-green-primary transition-colors">← Volver a la web</a> </p> </div> </div> `, "footer": ($$result2) => renderTemplate`<div></div>`, "header": ($$result2) => renderTemplate`<div></div>` })}`;
}, "/home/ruben/Proyectos/agropur/src/pages/admin/login.astro", void 0);

const $$file = "/home/ruben/Proyectos/agropur/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
