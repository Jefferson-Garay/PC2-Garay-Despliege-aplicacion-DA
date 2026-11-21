// Uso: node notificar.mjs exito | node notificar.mjs error "detalle opcional"
import { readFileSync } from 'node:fs'

const url = process.env.SLACK_WEBHOOK_URL
if (!url) {
  console.error('Falta la variable de entorno SLACK_WEBHOOK_URL')
  process.exit(1)
}

const estado = (process.argv[2] || '').toLowerCase()
if (estado !== 'exito' && estado !== 'error') {
  console.error('Uso: node notificar.mjs exito|error ["detalle"]')
  process.exit(1)
}

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
const detalle = process.argv[3] || (estado === 'exito' ? 'Las pruebas pasaron correctamente' : 'Las pruebas fallaron')
const titulo = estado === 'exito' ? '✅ ÉXITO' : '❌ ERROR'
const lineas = [
  `${titulo} - ${pkg.name} v${pkg.version}`,
  `Detalle: ${detalle}`,
  `Fecha: ${new Date().toISOString()}`,
]
if (process.env.ALUMNO) lineas.push(`Alumno: ${process.env.ALUMNO}`)

try {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: lineas.join('\n') }),
  })
  if (!r.ok) {
    console.error(`Slack respondió con estado ${r.status}`)
    process.exit(1)
  }
  console.log('Notificación enviada a Slack')
} catch (e) {
  console.error(`No se pudo contactar a Slack: ${e.message}`)
  process.exit(1)
}
