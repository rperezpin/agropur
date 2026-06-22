#!/usr/bin/env bash
#
# deploy.sh — Despliegue en servidor Arsys/Plesk (agropur.es)
#
# Se ejecuta DIRECTAMENTE en el servidor (vía SSH), dentro del directorio
# de la aplicación. Clona/actualiza el repo, instala dependencias, hace
# build y reinicia la app. Ver DEPLOY.md para el detalle de cada paso.
#
# Uso:
#   ./deploy.sh
#
# Variables opcionales (export antes de ejecutar, o editar valores por defecto):
#   REPO_URL    - URL del repositorio git (por defecto: origin de GitHub)
#   APP_DIR     - Ruta de la aplicación en el servidor
#   GIT_BRANCH  - Rama a desplegar (por defecto: main)
#   RESTART_CMD - Comando de reinicio (por defecto: passenger vía tmp/restart.txt)

set -euo pipefail

REPO_URL="${REPO_URL:-git@github.com:rperezpin/agropur.git}"
APP_DIR="${APP_DIR:-/var/www/vhosts/agropur.es/httpdocs}"
GIT_BRANCH="${GIT_BRANCH:-main}"
NODE_VERSION="${NODE_VERSION:-22}"

log() { echo -e "\n=== $* ===\n"; }

if command -v nodenv >/dev/null 2>&1; then
  export NODENV_VERSION="$NODE_VERSION"
fi

# ── Paso 1 — Clonar o actualizar el repositorio ─────────────────────────────
if [ -d "$APP_DIR/.git" ]; then
  log "Repositorio existente, actualizando ($GIT_BRANCH)"
  cd "$APP_DIR"
  git fetch origin "$GIT_BRANCH"
  git checkout "$GIT_BRANCH"
  git reset --hard "origin/$GIT_BRANCH"
else
  mkdir -p "$APP_DIR"
  cd "$APP_DIR"
  if [ -z "$(ls -A "$APP_DIR" 2>/dev/null)" ]; then
    log "Clonando repositorio en $APP_DIR"
    git clone --branch "$GIT_BRANCH" "$REPO_URL" .
  else
    # Plesk crea httpdocs con archivos por defecto (index.html, logos...).
    # Se inicializa git in-place y se descarta cualquier archivo no versionado
    # que no esté en .gitignore (no toca .env, data/, uploads/, node_modules).
    log "Directorio no vacío sin repositorio git: inicializando in-place y limpiando archivos por defecto de Plesk"
    git init
    git remote add origin "$REPO_URL"
    git fetch origin "$GIT_BRANCH"
    git checkout -f -B "$GIT_BRANCH" "origin/$GIT_BRANCH"
    git clean -fd
  fi
fi

# ── Paso 2 — Comprobar que existe .env ──────────────────────────────────────
if [ ! -f "$APP_DIR/.env" ]; then
  echo "ATENCION: no existe $APP_DIR/.env"
  echo "Crealo a partir de .env.example con las variables de produccion antes de continuar."
  exit 1
fi

# ── Paso 3 — Crear directorios de datos persistentes ────────────────────────
log "Creando directorios de datos persistentes"
mkdir -p "$APP_DIR/uploads/cv"
mkdir -p "$APP_DIR/data"
chmod 755 "$APP_DIR/uploads"
chmod 755 "$APP_DIR/data"

# ── Paso 4 — Instalar dependencias ──────────────────────────────────────────
log "Instalando dependencias (npm ci --production=false para build)"
npm ci

# ── Paso 5 — Build ──────────────────────────────────────────────────────────
log "Generando build (astro build)"
npm run build

# ── Paso 6 — Reinstalar solo dependencias de produccion ─────────────────────
log "Reinstalando dependencias de produccion"
npm prune --omit=dev

# ── Paso 7 — Reiniciar aplicacion ───────────────────────────────────────────
log "Reiniciando aplicacion"
if [ -n "${RESTART_CMD:-}" ]; then
  eval "$RESTART_CMD"
elif command -v pm2 >/dev/null 2>&1 && pm2 list 2>/dev/null | grep -q agropur; then
  pm2 restart agropur
else
  mkdir -p "$APP_DIR/tmp"
  touch "$APP_DIR/tmp/restart.txt"
fi

log "Deploy completado. Verifica https://www.agropur.es"
