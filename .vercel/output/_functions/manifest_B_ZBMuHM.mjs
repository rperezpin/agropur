import 'piccolore';
import { p as decodeKey } from './chunks/astro/server_D22Xuz0b.mjs';
import 'clsx';
import './chunks/astro-designed-error-pages_BZIOgnc4.mjs';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_B8W2bKB-.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/ruben/Proyectos/agropur/","cacheDir":"file:///home/ruben/Proyectos/agropur/node_modules/.astro/","outDir":"file:///home/ruben/Proyectos/agropur/dist/","srcDir":"file:///home/ruben/Proyectos/agropur/src/","publicDir":"file:///home/ruben/Proyectos/agropur/public/","buildClientDir":"file:///home/ruben/Proyectos/agropur/dist/client/","buildServerDir":"file:///home/ruben/Proyectos/agropur/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"aviso-legal/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/aviso-legal","isIndex":false,"type":"page","pattern":"^\\/aviso-legal\\/?$","segments":[[{"content":"aviso-legal","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/aviso-legal.astro","pathname":"/aviso-legal","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"contacto/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contacto","isIndex":false,"type":"page","pattern":"^\\/contacto\\/?$","segments":[[{"content":"contacto","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contacto.astro","pathname":"/contacto","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"cookies/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/cookies","isIndex":false,"type":"page","pattern":"^\\/cookies\\/?$","segments":[[{"content":"cookies","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/cookies.astro","pathname":"/cookies","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"digestato/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/digestato","isIndex":false,"type":"page","pattern":"^\\/digestato\\/?$","segments":[[{"content":"digestato","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/digestato.astro","pathname":"/digestato","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"privacidad/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/privacidad","isIndex":false,"type":"page","pattern":"^\\/privacidad\\/?$","segments":[[{"content":"privacidad","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacidad.astro","pathname":"/privacidad","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"servicios/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/servicios","isIndex":false,"type":"page","pattern":"^\\/servicios\\/?$","segments":[[{"content":"servicios","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/servicios.astro","pathname":"/servicios","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"sobre-nosotros/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/sobre-nosotros","isIndex":false,"type":"page","pattern":"^\\/sobre-nosotros\\/?$","segments":[[{"content":"sobre-nosotros","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sobre-nosotros.astro","pathname":"/sobre-nosotros","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"trabaja-con-nosotros/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/trabaja-con-nosotros","isIndex":false,"type":"page","pattern":"^\\/trabaja-con-nosotros\\/?$","segments":[[{"content":"trabaja-con-nosotros","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/trabaja-con-nosotros.astro","pathname":"/trabaja-con-nosotros","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/candidaturas.B5mH-irC.css"}],"routeData":{"route":"/admin/candidaturas","isIndex":false,"type":"page","pattern":"^\\/admin\\/candidaturas\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"candidaturas","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/candidaturas.astro","pathname":"/admin/candidaturas","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/candidaturas.B5mH-irC.css"}],"routeData":{"route":"/admin/contactos","isIndex":false,"type":"page","pattern":"^\\/admin\\/contactos\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"contactos","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/contactos.astro","pathname":"/admin/contactos","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/candidaturas.B5mH-irC.css"}],"routeData":{"route":"/admin/login","isIndex":false,"type":"page","pattern":"^\\/admin\\/login\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/login.astro","pathname":"/admin/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/candidaturas.B5mH-irC.css"}],"routeData":{"route":"/admin","isIndex":true,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/index.astro","pathname":"/admin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/login","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/login\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/login.ts","pathname":"/api/admin/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/logout","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/logout\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"logout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/logout.ts","pathname":"/api/admin/logout","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/apply","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/apply\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"apply","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/apply.ts","pathname":"/api/apply","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/contact","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/contact\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/contact.ts","pathname":"/api/contact","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/robots.txt","isIndex":false,"type":"endpoint","pattern":"^\\/robots\\.txt\\/?$","segments":[[{"content":"robots.txt","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/robots.txt.ts","pathname":"/robots.txt","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://www.agropur.es","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/ruben/Proyectos/agropur/src/pages/admin/candidaturas.astro",{"propagation":"none","containsHead":true}],["/home/ruben/Proyectos/agropur/src/pages/admin/contactos.astro",{"propagation":"none","containsHead":true}],["/home/ruben/Proyectos/agropur/src/pages/admin/index.astro",{"propagation":"none","containsHead":true}],["/home/ruben/Proyectos/agropur/src/pages/aviso-legal.astro",{"propagation":"none","containsHead":true}],["/home/ruben/Proyectos/agropur/src/pages/contacto.astro",{"propagation":"none","containsHead":true}],["/home/ruben/Proyectos/agropur/src/pages/cookies.astro",{"propagation":"none","containsHead":true}],["/home/ruben/Proyectos/agropur/src/pages/digestato.astro",{"propagation":"none","containsHead":true}],["/home/ruben/Proyectos/agropur/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/home/ruben/Proyectos/agropur/src/pages/privacidad.astro",{"propagation":"none","containsHead":true}],["/home/ruben/Proyectos/agropur/src/pages/servicios.astro",{"propagation":"none","containsHead":true}],["/home/ruben/Proyectos/agropur/src/pages/sobre-nosotros.astro",{"propagation":"none","containsHead":true}],["/home/ruben/Proyectos/agropur/src/pages/trabaja-con-nosotros.astro",{"propagation":"none","containsHead":true}],["/home/ruben/Proyectos/agropur/src/pages/admin/login.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/admin/candidaturas@_@astro":"pages/admin/candidaturas.astro.mjs","\u0000@astro-page:src/pages/admin/contactos@_@astro":"pages/admin/contactos.astro.mjs","\u0000@astro-page:src/pages/admin/login@_@astro":"pages/admin/login.astro.mjs","\u0000@astro-page:src/pages/admin/index@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/api/admin/login@_@ts":"pages/api/admin/login.astro.mjs","\u0000@astro-page:src/pages/api/admin/logout@_@ts":"pages/api/admin/logout.astro.mjs","\u0000@astro-page:src/pages/api/apply@_@ts":"pages/api/apply.astro.mjs","\u0000@astro-page:src/pages/api/contact@_@ts":"pages/api/contact.astro.mjs","\u0000@astro-page:src/pages/aviso-legal@_@astro":"pages/aviso-legal.astro.mjs","\u0000@astro-page:src/pages/contacto@_@astro":"pages/contacto.astro.mjs","\u0000@astro-page:src/pages/cookies@_@astro":"pages/cookies.astro.mjs","\u0000@astro-page:src/pages/digestato@_@astro":"pages/digestato.astro.mjs","\u0000@astro-page:src/pages/privacidad@_@astro":"pages/privacidad.astro.mjs","\u0000@astro-page:src/pages/robots.txt@_@ts":"pages/robots.txt.astro.mjs","\u0000@astro-page:src/pages/servicios@_@astro":"pages/servicios.astro.mjs","\u0000@astro-page:src/pages/sobre-nosotros@_@astro":"pages/sobre-nosotros.astro.mjs","\u0000@astro-page:src/pages/trabaja-con-nosotros@_@astro":"pages/trabaja-con-nosotros.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_B_ZBMuHM.mjs","/home/ruben/Proyectos/agropur/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BzE6iS4R.mjs","/home/ruben/Proyectos/agropur/src/components/shared/ContactForm.tsx":"_astro/ContactForm.B5Jrrg3H.js","/home/ruben/Proyectos/agropur/src/components/shared/JobApplicationForm.tsx":"_astro/JobApplicationForm.C2vWLpDc.js","/home/ruben/Proyectos/agropur/src/components/layout/MobileMenu.tsx":"_astro/MobileMenu.CFWkvJ5n.js","@astrojs/preact/client.js":"_astro/client.D9jucDrQ.js","/home/ruben/Proyectos/agropur/node_modules/@preact/signals/dist/signals.module.js":"_astro/signals.module.BS7a1U3r.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/candidaturas.B5mH-irC.css","/logo-agropur.jpeg","/logo-agropur.png","/logo.jpeg","/_astro/ContactForm.B5Jrrg3H.js","/_astro/JobApplicationForm.C2vWLpDc.js","/_astro/MobileMenu.CFWkvJ5n.js","/_astro/client.D9jucDrQ.js","/_astro/hooks.module.DolKhjTk.js","/_astro/jsxRuntime.module.wmpUa1Ri.js","/_astro/preact.module.BytUPcf3.js","/_astro/signals.module.BS7a1U3r.js","/images/balsa.jpeg","/images/campo.png","/images/cuba1.png","/images/cuba2.png","/images/equipo.png","/images/hero.png","/images/tractor.jpeg","/aviso-legal/index.html","/contacto/index.html","/cookies/index.html","/digestato/index.html","/privacidad/index.html","/servicios/index.html","/sobre-nosotros/index.html","/trabaja-con-nosotros/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"rDVJK/QX0Y0a3BrR0bfLy/lmD6ui+umJEzQdhtDFhFg="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
