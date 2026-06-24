# Desarrollo con la API local

Guía para conectar la app Expo (`inversora`) al backend NestJS (`inversora-api`) en entorno de desarrollo.

## Requisitos

- Node.js 20+ y npm 10+ en ambos repositorios.
- Docker Desktop (PostgreSQL local del backend).
- Backend sincronizado con fondos visibles en catálogo.

## 1. Levantar el backend

En `inversora-api`:

```bash
npm install
cp .env.example .env
npm run db:up
npm run db:validate
npm run prisma:migrate:deploy
npm run prisma:validate
npm run start:dev
```

Comprueba que responde:

```bash
curl http://localhost:3000/health
curl "http://localhost:3000/funds?page=1&limit=5"
```

Swagger: `http://localhost:3000/api/docs`

## 2. Configurar la app móvil

En `inversora`:

```bash
npm install
cp .env.example .env
```

Ajusta `EXPO_PUBLIC_API_URL` según dónde ejecutes la app:

| Entorno | Valor típico | CORS en la API |
|---------|----------------|----------------|
| iOS Simulator | `http://localhost:3000` | No aplica |
| Android Emulator | `http://10.0.2.2:3000` | No aplica |
| Dispositivo físico (LAN) | `http://192.168.x.x:3000` | No aplica |
| Expo web (`npm run web`) | `http://localhost:3000` | **Sí** — orígenes `8081` / `19006` |
| Staging (Railway) | `https://tu-api.railway.app` | Solo web; ver CORS en backend |

Atajo para imprimir URLs recomendadas:

```bash
npm run api:url
npm run api:url -- --lan
npm run api:url -- --android
npm run api:url -- --staging https://tu-api.railway.app
```

Reinicia Metro después de cambiar `.env`:

```bash
npm start
```

### Expo web y CORS

Expo web carga la app en `http://localhost:8081` (o `127.0.0.1:8081`) y llama a la API en otro puerto (`3000`). El navegador exige CORS en el backend.

En `inversora-api`, con `NODE_ENV=development` y `CORS_ORIGINS` vacío, los orígenes de Expo web ya están permitidos por defecto. En staging (`NODE_ENV=production`) debes definir:

```env
CORS_ORIGINS=http://localhost:8081,http://127.0.0.1:8081
```

Documentación completa: [inversora-api/docs/cors-and-expo-client.md](../../inversora-api/docs/cors-and-expo-client.md).

Si ves *blocked by CORS policy* en la consola del navegador:

1. Confirma que la API está en marcha (`curl http://localhost:3000/health`).
2. Comprueba el preflight: `curl -i -X OPTIONS http://localhost:3000/health -H "Origin: http://localhost:8081" -H "Access-Control-Request-Method: GET"`.
3. En staging, añade tu origen a `CORS_ORIGINS` en Railway y redeploy.

### Dispositivo físico en la red local

1. PC y móvil en la misma Wi‑Fi.
2. Obtén la IP LAN del PC: `npm run api:url -- --lan`.
3. Pon ese valor en `EXPO_PUBLIC_API_URL`.
4. Asegúrate de que el firewall de Windows permite conexiones entrantes al puerto `3000`.
5. Reinicia Expo.

CORS **no** afecta a apps nativas; solo importa la URL alcanzable desde el dispositivo.

### Túnel ngrok (opcional)

Útil para probar desde un dispositivo fuera de tu LAN o compartir la API:

```bash
# En inversora-api (con la API en :3000)
ngrok http 3000
```

En la app:

```env
EXPO_PUBLIC_API_URL=https://abcd1234.ngrok-free.app
```

- **Nativo:** suele bastar con la URL de ngrok.
- **Expo web:** el origen sigue siendo `localhost:8081`; no hace falta añadir la URL de ngrok a `CORS_ORIGINS` (CORS valida el origen de la *página*, no el de la API).
- Si publicas **también** la app web con ngrok, añade ese origen a `CORS_ORIGINS` en la API.

## 3. Endpoints y filtros (HU-07)

| Pantalla | Servicio | Endpoint |
|----------|----------|----------|
| Inicio (carrusel) | `getFeaturedFunds` | `GET /featured` |
| Catálogo (índice) | `getCatalogBrowseIndex` | `GET /funds` sin filtros |
| Catálogo (resultados) | `getFunds` | `GET /funds` con query params |
| Ranking (home) | `getRankings` | `GET /rankings` |
| Ficha por ISIN | `getFundByIsin` | `GET /funds/:isin` |
| SORA (buscador / ficha) | `explainAssistant` | `POST /assistant/explain` |

### Filtros enviados al backend

| Filtro UI | Parámetro API |
|-----------|---------------|
| Búsqueda | `q` |
| Categoría (`Índice X`) | `benchmark` |
| Comisión máxima | `maxTer` |
| Score mínimo | `minScore` |
| Para empezar | `idealForBeginnersOnly=true` |

El filtro de **riesgo** (bajo/medio/alto) se aplica en cliente porque la API acepta un valor numérico exacto, no rangos.

No se requiere autenticación en las rutas públicas del MVP.

### SORA (`POST /assistant/explain`)

Cuerpo JSON (ejemplo):

```json
{
  "surface": "home",
  "message": "¿Qué es el TER?",
  "locale": "es"
}
```

Respuesta: texto educativo, `source` (`glossary` | `cache` | `openai`), disclaimer legal y `promptVersion`.

En el backend, activa el asistente en `.env`:

```bash
ASSISTANT_ENABLED=true
OPENAI_API_KEY=sk-...
```

Si el backend no tiene el asistente activo, la app degrada al mock local del home search.

## 4. Recorrido manual de verificación

1. Abre la app y confirma que el carrusel de destacados carga (o queda vacío sin romper la pantalla).
2. Navega a **Catálogo** y espera la carga inicial.
3. Aplica filtros (comisión, score, categoría) y comprueba que los resultados cambian.
4. Abre una ficha desde una tarjeta del catálogo.
5. Compara datos con la API:

```bash
curl "http://localhost:3000/funds/US78462F1030"
curl "http://localhost:3000/funds?maxTer=0.25&minScore=75"
curl "http://localhost:3000/rankings"
```

6. Desconecta el backend y comprueba error + reintentar sin bloquear navegación.

## 5. Poblar ranking (`GET /rankings`)

Un fondo solo entra en el ranking si cumple **todo** esto en la base de datos:

| Campo | Requisito |
|-------|-----------|
| `catalogVisibility` | `visible` |
| `benchmark` | No nulo (se infiere del nombre en el sync) |
| `isin` | No nulo |
| `metrics.ter` | No nulo |
| `score` | No nulo (paso `scoring` del sync) |

Si `GET /rankings` devuelve `{"data":[]}` pero `GET /funds` sí lista fondos, casi siempre falta **sync con scoring** o el fondo se importó antes de tener benchmark.

En `inversora-api` (PostgreSQL levantado):

```bash
# Windows (PowerShell): pasa flags al script directamente
node --env-file=.env -r ts-node/register -r tsconfig-paths/register src/cli/run-fund-sync.ts --symbols SPY

# Bash / macOS / Linux
npm run sync:run -- --symbols SPY
```

Para varios tickers de prueba:

```bash
node --env-file=.env -r ts-node/register -r tsconfig-paths/register src/cli/run-fund-sync.ts --symbols SPY,QQQ
```

Comprueba:

```bash
curl http://localhost:3000/rankings
```

## 6. Problemas frecuentes

| Síntoma | Causa probable | Acción |
|---------|----------------|--------|
| "No se pudo conectar con la API" | URL incorrecta o backend apagado | Revisa `EXPO_PUBLIC_API_URL` y `npm run start:dev` |
| CORS / *blocked by CORS policy* (solo web) | `CORS_ORIGINS` vacío en staging o API distinta | Ver § Expo web y CORS; [cors-and-expo-client.md](../../inversora-api/docs/cors-and-expo-client.md) |
| Dispositivo no alcanza la API | IP LAN incorrecta o firewall | `npm run api:url -- --lan`; abre puerto 3000 |
| Catálogo vacío sin error | Sin fondos `visible` en BD | Ejecuta sync/admin en el backend |
| Ranking vacío (`{"data":[]}`) | Fondos sin `benchmark` o sin `score` calculado | Ejecuta sync completo (metadata + scoring); ver §5 |
| Ficha 404 | ISIN inexistente o fondo no visible | Usa un ISIN del catálogo |
| Filtros no cambian resultados | Caché de Metro o API sin datos | Reinicia Expo; verifica query en Swagger |

## Referencias

- CORS (backend): [inversora-api/docs/cors-and-expo-client.md](../../inversora-api/docs/cors-and-expo-client.md)
- Staging (Neon + Railway): [inversora-api/docs/staging-deploy.md](../../inversora-api/docs/staging-deploy.md)
- Contrato BFF ficha: [inversora-api/docs/bff-fund-detail-contract.md](../../inversora-api/docs/bff-fund-detail-contract.md)
- Cliente HTTP: `src/core/api/client.ts` (`apiGet`, `apiPost`)
- Cliente SORA: `src/core/api/assistant-client.ts`
- Mapeo de filtros: `src/core/api/map-catalog-filters-to-query.ts`
