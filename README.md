# tienda-api (PC02 - Despliegue de Aplicaciones)

Alumno: Garay - Jefferson · ESAN · Ciclo 2026-2

API de ejemplo sin dependencias. Requiere Node.js 20 o superior.

    npm test            # ejecuta las pruebas
    npm run test:cov    # pruebas con cobertura
    npm start           # inicia el servidor en el puerto 3000
    node verificar.mjs  # autoverificación de la parte práctica
    npm run pipeline    # pruebas y notificación a Slack (requiere SLACK_WEBHOOK_URL)

Rutas: `/productos`, `/total?ids=1,2&cupon=DESC10`, `/health`, `/ready`.

## Resumen de la solución

- **T1** – `src/precios.js`: el cupón ahora *descuenta* (`1 - descuento`) y se busca sin distinguir mayúsculas. Se agregaron pruebas de `validarCantidad` y `aplicarCupon`; cobertura de líneas 100 %.
- **T2** – `server.js`: `/health`, `/ready` (503 si `BASE_DE_DATOS_OK=false`) y log JSON por petición (`ts, level, msg, method, path, status, ms`).
- **T3** – `notificar.mjs` lee `SLACK_WEBHOOK_URL` del entorno (nunca se guarda en archivos) y `npm run pipeline` notifica éxito o error.
- **T4** – `.github/workflows/ci.yml`: PR hacia `main`, Node 22, `npm ci`, `npm test` y notificación con `if: success()` / `if: failure()`. Requiere el secret `SLACK_WEBHOOK_URL` en el repositorio.
- **Versionado** – tags `v1.0.0` y `v1.1.0`, y rollback con `git revert` (ver historial).

## Despliegue (T5)

- Plataforma: **Render** (Web Service, plan Free, build `npm ci`, comando de inicio `npm start`).
- URL pública: https://tienda-api-garay.onrender.com
- Comprobación: `GET https://tienda-api-garay.onrender.com/health` responde `200 {"status":"ok"}`.

## Uso de Slack

PowerShell:

    $env:SLACK_WEBHOOK_URL="URL_DEL_DOCENTE"
    $env:ALUMNO="Garay Jefferson"
    npm run pipeline
