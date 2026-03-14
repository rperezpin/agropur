import { compare } from 'bcryptjs';
import { c as createSessionCookie } from '../../../chunks/auth_G0U3wNb4.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({
  request,
  redirect
}) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const adminUser = "admin";
  const adminHash = "$2b$10";
  if (username !== adminUser || !adminHash) {
    return redirect("/admin/login?error=1");
  }
  const isValid = await compare(password, adminHash);
  if (!isValid) {
    return redirect("/admin/login?error=1");
  }
  const cookie = createSessionCookie(username);
  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": cookie,
      Location: "/admin"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
