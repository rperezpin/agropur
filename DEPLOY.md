# DEPLOY.md — Guía de Despliegue en Arsys / Plesk

## Requisitos Previos

- Servidor Arsys con Plesk instalado
- Soporte Node.js habilitado en Plesk (Passenger o PM2)
- Versión Node.js: **18 LTS** o superior (recomendado 20 LTS)
- Dominio configurado y apuntando al servidor
- SSL/TLS activo (Let's Encrypt desde Plesk)

---

## Paso 1 — Build Local

```bash
# En tu máquina de desarrollo
cd agropur-web
npm run build
```

Esto genera:
- `dist/server/` — la aplicación Node.js SSR
- `dist/client/` — assets estáticos (CSS, JS, imágenes optimizadas)
- El archivo de entrada es `dist/server/entry.mjs`

---

## Paso 2 — Preparar Archivos para Subir

Subir al servidor los siguientes archivos/carpetas:

```
dist/               ← Build completo
package.json        ← Para npm install en servidor
package-lock.json   ← Para versiones exactas
.env                ← Variables de entorno (NO subir a git)
```

> **Importante:** NO subir `node_modules/` — se instalan en el servidor.
> NO subir `data/` ni `uploads/` — se crean automáticamente en el servidor.

Método de subida recomendado: **Git + SSH** o **FTP desde Plesk File Manager**.

---

## Paso 3 — Configurar Node.js en Plesk

1. Entrar en Plesk → seleccionar el dominio (`agropur.es`)
2. Ir a **Node.js** en el panel del dominio
3. Configurar:
   - **Node.js version:** 20.x LTS
   - **Document root:** `/httpdocs` (o la carpeta raíz del dominio)
   - **Application root:** ruta donde están los archivos subidos (ej. `/var/www/vhosts/agropur.es/httpdocs`)
   - **Application startup file:** `dist/server/entry.mjs`
4. Guardar

---

## Paso 4 — Instalar Dependencias en Servidor

Desde la terminal SSH de Plesk o desde **Node.js → NPM** en el panel:

```bash
cd /var/www/vhosts/agropur.es/httpdocs
npm install --production
```

---

## Paso 5 — Variables de Entorno en Plesk

En Plesk → Node.js → **Environment Variables**, añadir:

```
SMTP_HOST          = mail.arsys.es
SMTP_PORT          = 465
SMTP_SECURE        = true
SMTP_USER          = info@agropur.es
SMTP_PASS          = [contraseña SMTP]
CONTACT_EMAIL      = info@agropur.es
JOB_EMAIL          = rrhh@agropur.es
ADMIN_USER         = admin
ADMIN_PASSWORD_HASH= [hash bcrypt generado]
SESSION_SECRET     = [string aleatorio 32+ caracteres]
UPLOAD_DIR         = /var/www/vhosts/agropur.es/uploads/cv
DB_PATH            = /var/www/vhosts/agropur.es/data/agropur.db
PUBLIC_SITE_URL    = https://www.agropur.es
```

---

## Paso 6 — Crear Directorios de Datos

```bash
mkdir -p /var/www/vhosts/agropur.es/uploads/cv
mkdir -p /var/www/vhosts/agropur.es/data
chmod 755 /var/www/vhosts/agropur.es/uploads
chmod 755 /var/www/vhosts/agropur.es/data
```

---

## Paso 7 — Generar Hash de Contraseña Admin

En local, ejecutar una vez para generar el hash bcrypt:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('TU_CONTRASEÑA_AQUI', 10).then(h => console.log(h))"
```

Copiar el resultado (empieza por `$2b$10$...`) como valor de `ADMIN_PASSWORD_HASH`.

---

## Paso 8 — Activar SSL

En Plesk → SSL/TLS Certificates → **Let's Encrypt**:
1. Activar certificado gratuito para `agropur.es` y `www.agropur.es`
2. Activar redirección HTTP → HTTPS automática

---

## Paso 9 — Reiniciar Aplicación

En Plesk → Node.js → **Restart App**

O por SSH:
```bash
# Si usa Passenger (automático con Plesk)
touch /var/www/vhosts/agropur.es/httpdocs/tmp/restart.txt

# Si usa PM2
pm2 restart agropur
```

---

## Paso 10 — Verificar

- [ ] `https://www.agropur.es` carga correctamente
- [ ] `https://www.agropur.es/servicios` carga
- [ ] Formulario de contacto envía email
- [ ] Formulario de candidatura sube CV y envía email
- [ ] `https://www.agropur.es/admin/login` muestra el login
- [ ] Login de admin funciona
- [ ] Panel de admin muestra contactos y candidaturas
- [ ] HTTPS activo y redirige desde HTTP

---

## Actualizaciones Futuras

Para actualizar la web:

```bash
# 1. En local: hacer cambios y build
npm run build

# 2. Subir dist/ al servidor (sobreescribe)
# vía FTP, rsync, o git pull en servidor

# 3. Reiniciar app en Plesk si es necesario
```

Si solo cambian assets estáticos (CSS, imágenes), no hace falta reiniciar.
Si cambia lógica de servidor (endpoints, middleware), sí reiniciar.

---

## Troubleshooting Común

**Error 502 Bad Gateway:**
- Verificar que Node.js está iniciado en Plesk
- Revisar logs: Plesk → Logs → Node.js app logs
- Comprobar que `dist/server/entry.mjs` existe

**Formulario no envía email:**
- Verificar variables SMTP en Plesk
- Comprobar que el puerto 465 no está bloqueado por firewall de Arsys
- Alternativa: usar puerto 587 con `SMTP_SECURE=false` y STARTTLS

**CV no se guarda:**
- Verificar que `UPLOAD_DIR` existe y tiene permisos de escritura
- Verificar espacio en disco disponible

**Admin no guarda datos:**
- Verificar que `DB_PATH` es una ruta con permisos de escritura
- La primera vez, la DB se crea automáticamente al recibir el primer mensaje

**Assets estáticos (CSS/imágenes) no cargan:**
- En Plesk, verificar que el Document Root apunta a `dist/client/` para archivos estáticos
- O configurar Astro para servir los estáticos desde el servidor Node (ya incluido en `standalone` mode)
