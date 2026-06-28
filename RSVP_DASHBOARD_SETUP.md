# RSVP Dashboard — Configuración en Vercel

## Variables de entorno requeridas

Agregar en el panel de Vercel: **Settings → Environment Variables**

| Variable | Descripción |
|---|---|
| `SUPABASE_URL` | URL del proyecto Supabase. Ejemplo: `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave `service_role` (NO la clave `anon`). Se encuentra en Supabase → Settings → API. |
| `RSVP_NIEVES_JESUS_PIN` | PIN que protege el dashboard. Puede ser numérico o alfanumérico. |

> ⚠️ **Nunca** colocar `SUPABASE_SERVICE_ROLE_KEY` en código cliente, archivos HTML o en el repositorio.

## Cómo obtener la service_role key en Supabase

1. Ir a [supabase.com](https://supabase.com) → tu proyecto
2. Settings → API
3. Copiar el valor de **service_role** (no el de anon/public)

## URLs del sistema

| Recurso | Ruta |
|---|---|
| Dashboard RSVP | `/inv/nieves-y-jesus/respuestas.html` |
| API (solo lectura con PIN) | `/api/rsvp-report?invitacion=nieves-y-jesus&pin=TU_PIN` |
| Invitación (preview) | `/inv/nieves-y-jesus/preview.html` |

## Políticas de Supabase recomendadas

La tabla `rsvp` debe tener:
- **INSERT** habilitado para `anon` (para que el formulario de invitados funcione)
- **SELECT** solo habilitado para `service_role` (la API serverless)
- **Sin SELECT público** — el dashboard lee con la service_role key desde el servidor

## Runtime requerido

La función `api/rsvp-report.js` usa `fetch` nativo. Requiere **Node.js 18** o superior (default en Vercel desde 2023).
