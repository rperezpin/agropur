/**
 * Genera un hash bcrypt para la contraseña del panel de administración.
 *
 * Uso:
 *   node scripts/generate-admin-hash.mjs
 *   node scripts/generate-admin-hash.mjs miContraseña123
 *
 * El resultado se debe copiar en la variable ADMIN_PASSWORD_HASH del .env
 */

import bcrypt from 'bcryptjs'
import { createInterface } from 'node:readline'

async function main() {
  let password = process.argv[2]

  if (!password) {
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    password = await new Promise((resolve) => {
      rl.question('Introduce la contraseña del admin: ', (answer) => {
        rl.close()
        resolve(answer.trim())
      })
    })
  }

  if (!password || password.length < 8) {
    console.error('Error: la contraseña debe tener al menos 8 caracteres.')
    process.exit(1)
  }

  const hash = await bcrypt.hash(password, 10)

  console.log('\n✅ Hash generado correctamente.\n')
  console.log('Copia esta línea en tu archivo .env:\n')
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
