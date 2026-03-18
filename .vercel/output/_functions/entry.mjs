import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Cve0Vs5Y.mjs';
import { manifest } from './manifest_Uob1Xsfb.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/candidaturas.astro.mjs');
const _page2 = () => import('./pages/admin/contactos.astro.mjs');
const _page3 = () => import('./pages/admin/login.astro.mjs');
const _page4 = () => import('./pages/admin.astro.mjs');
const _page5 = () => import('./pages/api/admin/login.astro.mjs');
const _page6 = () => import('./pages/api/admin/logout.astro.mjs');
const _page7 = () => import('./pages/api/apply.astro.mjs');
const _page8 = () => import('./pages/api/contact.astro.mjs');
const _page9 = () => import('./pages/aviso-legal.astro.mjs');
const _page10 = () => import('./pages/contacto.astro.mjs');
const _page11 = () => import('./pages/cookies.astro.mjs');
const _page12 = () => import('./pages/digestato.astro.mjs');
const _page13 = () => import('./pages/privacidad.astro.mjs');
const _page14 = () => import('./pages/robots.txt.astro.mjs');
const _page15 = () => import('./pages/servicios.astro.mjs');
const _page16 = () => import('./pages/sobre-nosotros.astro.mjs');
const _page17 = () => import('./pages/trabaja-con-nosotros.astro.mjs');
const _page18 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin/candidaturas.astro", _page1],
    ["src/pages/admin/contactos.astro", _page2],
    ["src/pages/admin/login.astro", _page3],
    ["src/pages/admin/index.astro", _page4],
    ["src/pages/api/admin/login.ts", _page5],
    ["src/pages/api/admin/logout.ts", _page6],
    ["src/pages/api/apply.ts", _page7],
    ["src/pages/api/contact.ts", _page8],
    ["src/pages/aviso-legal.astro", _page9],
    ["src/pages/contacto.astro", _page10],
    ["src/pages/cookies.astro", _page11],
    ["src/pages/digestato.astro", _page12],
    ["src/pages/privacidad.astro", _page13],
    ["src/pages/robots.txt.ts", _page14],
    ["src/pages/servicios.astro", _page15],
    ["src/pages/sobre-nosotros.astro", _page16],
    ["src/pages/trabaja-con-nosotros.astro", _page17],
    ["src/pages/index.astro", _page18]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "822faf7a-2211-43de-b648-9416535313b5",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
