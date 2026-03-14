import { d as defineMiddleware, s as sequence } from './chunks/index_Cm1sGYEt.mjs';
import { v as verifySession } from './chunks/auth_G0U3wNb4.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_BZIOgnc4.mjs';
import 'piccolore';
import './chunks/astro/server_D22Xuz0b.mjs';
import 'clsx';

const onRequest$1 = defineMiddleware((context, next) => {
  const {
    pathname
  } = context.url;
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const cookieHeader = context.request.headers.get("cookie");
    const isValid = verifySession(cookieHeader);
    if (!isValid) {
      return context.redirect("/admin/login");
    }
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
