import { a as clearSessionCookie } from '../../../chunks/auth_G0U3wNb4.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async () => {
  const cookie = clearSessionCookie();
  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": cookie,
      Location: "/admin/login"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
