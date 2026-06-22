#!/usr/bin/env bash
set -euo pipefail

# ==== Paths ====
BASE_DIR="${BASE_DIR:-$HOME}"
DOCROOT="${DOCROOT:-$BASE_DIR/httpdocs}"
REPO_DIR="${REPO_DIR:-$BASE_DIR/repo}"
APP_ENTRY="${APP_ENTRY:-$BASE_DIR/app.mjs}"
DATA_DIR="${DATA_DIR:-$BASE_DIR/data}"
UPLOAD_DIR="${UPLOAD_DIR:-$BASE_DIR/uploads/cv}"

# ==== Git ====
GIT_URL="${GIT_URL:-git@github.com:rperezpin/agropur.git}"
BRANCH="${BRANCH:-main}"

GIT_SSH_KEY="${GIT_SSH_KEY:-$HOME/.ssh/github_agropur}"
if [ -f "$GIT_SSH_KEY" ]; then
    export GIT_SSH_COMMAND="ssh -i $GIT_SSH_KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes"
fi

# ==== Node ====
NODENV_ROOT="${NODENV_ROOT:-$HOME/.nodenv}"
NODE_VERSION_DEFAULT="${NODE_VERSION:-22}"
export NODE_OPTIONS="${NODE_OPTIONS:---max_old_space_size=512}"

APP_PORT="${APP_PORT:-4327}"
PID_FILE="$BASE_DIR/server.pid"
LOG_FILE="$BASE_DIR/server.log"

ts()  { date +"%F %T"; }
log() { echo "[$(ts)] $*"; }
die() { echo "ERROR: $*" >&2; exit 1; }

activate_node() {
    local req="$NODE_VERSION_DEFAULT"
    local node_v="" npm_v=""

    [ -f "$REPO_DIR/.node-version" ] && req="$(tr -d ' \t\r\n' < "$REPO_DIR/.node-version")"

    # Exportar ANTES de init para que los shims lo vean desde el primer momento
    export NODENV_VERSION="$req"

    local _nodenv=""
    if [ -x "$NODENV_ROOT/bin/nodenv" ]; then
        _nodenv="$NODENV_ROOT/bin/nodenv"
        export PATH="$NODENV_ROOT/shims:$NODENV_ROOT/bin:$PATH"
        eval "$("$_nodenv" init - bash)" >/dev/null 2>&1 || true
        "$_nodenv" install -s "$NODENV_VERSION" 2>/dev/null || true
        "$_nodenv" rehash 2>/dev/null || true
        hash -r 2>/dev/null || true
    elif command -v nodenv >/dev/null 2>&1; then
        _nodenv="$(command -v nodenv)"
        eval "$(nodenv init - bash)" >/dev/null 2>&1 || true
        nodenv install -s "$NODENV_VERSION" 2>/dev/null || true
        nodenv rehash 2>/dev/null || true
        hash -r 2>/dev/null || true
    fi

    # Si la versión pedida no está instalada, usar la más reciente disponible en nodenv
    if [ -n "$_nodenv" ] && ! node -v >/dev/null 2>&1; then
        local fallback
        fallback="$("$_nodenv" versions --bare 2>/dev/null | grep -v system | sort -V | tail -1 || true)"
        if [ -n "$fallback" ]; then
            export NODENV_VERSION="$fallback"
            log "Versión $req no encontrada en nodenv, usando $fallback"
            hash -r 2>/dev/null || true
        else
            unset NODENV_VERSION
            hash -r 2>/dev/null || true
        fi
    fi

    command -v node >/dev/null 2>&1 || die "node no disponible"
    command -v npm  >/dev/null 2>&1 || die "npm no disponible"

    node_v="$(node -v 2>/dev/null || true)"
    npm_v="$(npm  -v 2>/dev/null || true)"

    [ -n "$node_v" ] || die "node presente pero no ejecutable (revisa la selección de versión de nodenv)"
    [ -n "$npm_v"  ] || die "npm presente pero no ejecutable (revisa la selección de versión de nodenv)"
    log "Node: $node_v | NPM: $npm_v"
}

stop_server() {
    if [ -f "$PID_FILE" ]; then
        local pid
        pid=$(cat "$PID_FILE" 2>/dev/null || true)
        if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
            log "Parando servidor (PID $pid)..."
            kill "$pid" 2>/dev/null || true
            sleep 1
        fi
        rm -f "$PID_FILE"
    fi
}

start_server() {
    [ -f "$APP_ENTRY" ] || die "Falta $APP_ENTRY"
    log "Arrancando servidor en puerto $APP_PORT..."
    PORT="$APP_PORT" HOST="localhost" NODE_ENV="production" \
        nohup node "$APP_ENTRY" >> "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    log "Servidor arrancado (PID $(cat "$PID_FILE"), log: $LOG_FILE)"

    # Esperar hasta 15 s a que responda
    local i=0
    while [ $i -lt 15 ]; do
        if curl -s -o /dev/null -w "%{http_code}" \
                "http://localhost:$APP_PORT/api/contact" 2>/dev/null \
                | grep -qE "^[2-5][0-9]{2}$"; then
            log "Servidor disponible en localhost:$APP_PORT"
            return 0
        fi
        i=$((i + 1))
        sleep 1
    done
    log "AVISO: el servidor no respondió en 15 s. Revisa $LOG_FILE"
}

echo "[$(ts)] == START DEPLOY (agropur) =="

# Evitar prompt de host key
mkdir -p "$HOME/.ssh" && chmod 700 "$HOME/.ssh"
grep -q "github.com" "$HOME/.ssh/known_hosts" 2>/dev/null || \
    ssh-keyscan -t ed25519 github.com >> "$HOME/.ssh/known_hosts" 2>/dev/null || true
chmod 600 "$HOME/.ssh/known_hosts" 2>/dev/null || true

# ==== Git ====
if [ ! -d "$REPO_DIR/.git" ]; then
    log "Clonando $GIT_URL en $REPO_DIR ..."
    rm -rf "$REPO_DIR"
    git clone --branch "$BRANCH" "$GIT_URL" "$REPO_DIR"
else
    log "Repo detectado. Actualizando..."
    git -C "$REPO_DIR" remote set-url origin "$GIT_URL" || true
    git -C "$REPO_DIR" fetch origin --prune || true
    git -C "$REPO_DIR" checkout "$BRANCH" 2>/dev/null || git -C "$REPO_DIR" checkout -b "$BRANCH"
    git -C "$REPO_DIR" reset --hard "origin/$BRANCH" || true
fi

activate_node

log "Limpiando node_modules..."
rm -rf "$REPO_DIR/node_modules"

log "Instalando dependencias..."
if [ -f "$REPO_DIR/package-lock.json" ]; then
    (cd "$REPO_DIR" && npm ci --no-audit --no-fund)
else
    (cd "$REPO_DIR" && npm install --no-audit --no-fund)
fi

# Copiar .env al repo para el build (Astro/Vite lo carga solo desde su cwd;
# no se "source"-a aquí porque valores como el hash bcrypt $2b$10$... rompen
# el parseo de bash al contener $2, $10, etc.)
if [ -f "$DOCROOT/.env" ]; then
    log "Copiando $DOCROOT/.env al repo para el build..."
    cp "$DOCROOT/.env" "$REPO_DIR/.env"
else
    die "Falta $DOCROOT/.env. Crealo a partir de .env.example con las variables de produccion antes de desplegar."
fi

log "Compilando..."
(cd "$REPO_DIR" && npm run build)

# Limpiar copia de .env del repo (los secretos solo en DOCROOT)
rm -f "$REPO_DIR/.env"

SERVER_ENTRY="$REPO_DIR/dist/server/entry.mjs"
CLIENT_DIR="$REPO_DIR/dist/client"

[ -f "$SERVER_ENTRY" ] || die "Falta $SERVER_ENTRY tras el build."
[ -d "$CLIENT_DIR"   ] || die "Falta $CLIENT_DIR tras el build."
[ -n "$(ls -A "$CLIENT_DIR" 2>/dev/null)" ] || die "$CLIENT_DIR vacío tras el build."

# ==== Directorios de datos persistentes (DB SQLite + CVs subidos) ====
# Viven fuera de DOCROOT (que se sobreescribe con --delete) y fuera de REPO_DIR
# (que se reclona/limpia en cada deploy). DB_PATH y UPLOAD_DIR en .env deben
# apuntar aquí con ruta absoluta.
log "Creando directorios de datos persistentes..."
mkdir -p "$UPLOAD_DIR" "$DATA_DIR"
chmod 755 "$BASE_DIR/uploads" "$DATA_DIR" 2>/dev/null || true

# ==== Deploy assets estáticos ====
log "Desplegando assets estáticos en $DOCROOT ..."
mkdir -p "$DOCROOT"

if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete --human-readable \
        --exclude ".well-known" \
        --exclude ".env" \
        "$CLIENT_DIR/" "$DOCROOT/"
else
    find "$DOCROOT" -mindepth 1 -maxdepth 1 \
        -not -name ".well-known" -a -not -name ".env" \
        -exec rm -rf {} +
    cp -a "$CLIENT_DIR/." "$DOCROOT/"
fi

# ==== Entrypoint estable para Plesk Node.js ====
# app.mjs está en una ruta fija; carga el .env e importa el servidor SSR del repo
log "Escribiendo entrypoint en $APP_ENTRY ..."
cat > "$APP_ENTRY" << 'ENTRY_EOF'
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "httpdocs", ".env");
try {
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
            const key = trimmed.substring(0, eqIdx).trim();
            const val = trimmed.substring(eqIdx + 1).trim();
            if (!(key in process.env)) process.env[key] = val;
        }
    }
} catch (_) { /* .env no encontrado, usar env del sistema */ }

ENTRY_EOF

# Añadir el import dinámico del servidor (necesita expansión de variable)
cat >> "$APP_ENTRY" << EOF
await import("${SERVER_ENTRY}");
EOF

# Proteger .env en .htaccess
HTACCESS="$DOCROOT/.htaccess"
if [ -f "$HTACCESS" ]; then
    if ! grep -q "Deny access to .env" "$HTACCESS" 2>/dev/null; then
        log "Protegiendo .env en .htaccess..."
        {
            echo ""
            echo "# Deny access to .env"
            echo "<Files \".env\">"
            echo "  Require all denied"
            echo "</Files>"
        } >> "$HTACCESS"
    fi
fi

# ==== Permisos ====
log "Ajustando permisos..."
find "$DOCROOT" -type d -exec chmod 755 {} + 2>/dev/null || true
find "$DOCROOT" -type f -exec chmod 644 {} + 2>/dev/null || true
chmod 644 "$APP_ENTRY" 2>/dev/null || true

[ -f "$DOCROOT/.env" ] && chmod 600 "$DOCROOT/.env" 2>/dev/null || true

stop_server
start_server

log "== DONE. Estáticos → $DOCROOT | Servidor SSR → puerto $APP_PORT =="
