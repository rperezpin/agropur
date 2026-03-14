import { e as createAstro, f as createComponent, r as renderTemplate, l as renderSlot, k as renderComponent, o as renderHead, h as addAttribute, n as Fragment } from './astro/server_D22Xuz0b.mjs';
import 'piccolore';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.agropur.es");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title, description, ogImage = "/logo-agropur.jpeg" } = Astro2.props;
  const canonicalUrl = new URL(Astro2.url.pathname, Astro2.site).href;
  return renderTemplate(_a || (_a = __template(['<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', '</title><meta name="description"', '><link rel="canonical"', '><!-- Favicon --><link rel="icon" type="image/jpeg" href="/logo-agropur.jpeg"><!-- Open Graph --><meta property="og:type" content="website"><meta property="og:locale" content="es_ES"><meta property="og:title"', '><meta property="og:description"', '><meta property="og:url"', '><meta property="og:site_name" content="Agropur Centro Gestor S.L."><meta property="og:image"', '><!-- Twitter Card --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><!-- Google Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet"><!-- AOS CSS --><link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet"><!-- Slot for page-specific head content (JSON-LD etc.) -->', "", '</head> <body class="font-body text-gray-dark bg-white antialiased"> ', " <main> ", " </main> ", ` <!-- AOS JS --> <script src="https://unpkg.com/aos@2.3.4/dist/aos.js"><\/script> <script>
      AOS.init({
        duration: 700,
        once: true,
        easing: 'ease-out-cubic',
        offset: 60,
        delay: 0,
      })
    <\/script> </body> </html>`])), title, addAttribute(description, "content"), addAttribute(canonicalUrl, "href"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(canonicalUrl, "content"), addAttribute(ogImage, "content"), addAttribute(title, "content"), addAttribute(description, "content"), renderSlot($$result, $$slots["head"]), renderHead(), renderSlot($$result, $$slots["header"], renderTemplate` ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${renderSlot($$result2, $$slots["default-header"])} ` })} `), renderSlot($$result, $$slots["default"]), renderSlot($$result, $$slots["footer"]));
}, "/home/ruben/Proyectos/agropur/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
