import { z } from 'zod';
import { s as sendApplicationNotification } from '../../chunks/mailer_DHB7oqz1.mjs';
export { renderers } from '../../renderers.mjs';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const applySchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email no válido"),
  telefono: z.string().min(6, "El teléfono es obligatorio"),
  perfil: z.string().min(1, "Selecciona un perfil"),
  experiencia: z.string().optional(),
  lopd: z.string().refine((v) => v === "true", "Debes aceptar la política de privacidad")
});
const POST = async ({
  request
}) => {
  try {
    const formData = await request.formData();
    const fields = {
      nombre: formData.get("nombre"),
      email: formData.get("email"),
      telefono: formData.get("telefono"),
      perfil: formData.get("perfil"),
      experiencia: formData.get("experiencia") || void 0,
      lopd: formData.get("lopd")
    };
    const result = applySchema.safeParse(fields);
    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        errors: result.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message
        }))
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const cvFile = formData.get("cv");
    let cvBuffer;
    let cvFilename;
    if (cvFile && cvFile.size > 0) {
      if (cvFile.type !== "application/pdf") {
        return new Response(JSON.stringify({
          success: false,
          errors: [{
            field: "cv",
            message: "El CV debe ser un archivo PDF"
          }]
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
      if (cvFile.size > MAX_FILE_SIZE) {
        return new Response(JSON.stringify({
          success: false,
          errors: [{
            field: "cv",
            message: "El CV no debe superar los 5MB"
          }]
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
      const arrayBuffer = await cvFile.arrayBuffer();
      cvBuffer = Buffer.from(arrayBuffer);
      cvFilename = cvFile.name || "curriculum.pdf";
    }
    await sendApplicationNotification({
      nombre: result.data.nombre,
      email: result.data.email,
      telefono: result.data.telefono,
      perfil: result.data.perfil,
      experiencia: result.data.experiencia,
      cvBuffer,
      cvFilename
    });
    return new Response(JSON.stringify({
      success: true
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Apply API error:", error);
    return new Response(JSON.stringify({
      success: false,
      errors: [{
        field: "general",
        message: "Error interno del servidor"
      }]
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
