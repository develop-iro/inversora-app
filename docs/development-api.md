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

| Entorno | Valor típico |
|---------|----------------|
| iOS Simulator | `http://localhost:3000` |
| Android Emulator | `http://10.0.2.2:3000` |
| Dispositivo físico | `http://192.168.x.x:3000` (IP LAN del PC) |

Reinicia Metro después de cambiar `.env`:

```bash
npm start
```

## 3. Endpoints y filtros (HU-07)

| Pantalla | Servicio | Endpoint |
|----------|----------|----------|
| Inicio (carrusel) | `getFeaturedFunds` | `GET /featured` |
| Catálogo (índice) | `getCatalogBrowseIndex` | `GET /funds` sin filtros |
| Catálogo (resultados) | `getFunds` | `GET /funds` con query params |
| Ficha por ISIN | `getFundByIsin` | `GET /funds/:isin` |

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

## 4. Recorrido manual de verificación

1. Abre la app y confirma que el carrusel de destacados carga (o queda vacío sin romper la pantalla).
2. Navega a **Catálogo** y espera la carga inicial.
3. Aplica filtros (comisión, score, categoría) y comprueba que los resultados cambian.
4. Abre una ficha desde una tarjeta del catálogo.
5. Compara datos con la API:

```bash
curl "http://localhost:3000/funds/US78462F1030"
curl "http://localhost:3000/funds?maxTer=0.25&minScore=75"
```

6. Desconecta el backend y comprueba error + reintentar sin bloquear navegación.

## 5. Problemas frecuentes

| Síntoma | Causa probable | Acción |
|---------|----------------|--------|
| "No se pudo conectar con la API" | URL incorrecta o backend apagado | Revisa `EXPO_PUBLIC_API_URL` y `npm run start:dev` |
| Catálogo vacío sin error | Sin fondos `visible` en BD | Ejecuta sync/admin en el backend |
| Ficha 404 | ISIN inexistente o fondo no visible | Usa un ISIN del catálogo |
| Filtros no cambian resultados | Caché de Metro o API sin datos | Reinicia Expo; verifica query en Swagger |

## Referencias

- Contrato BFF ficha: [inversora-api/docs/bff-fund-detail-contract.md](../../inversora-api/docs/bff-fund-detail-contract.md)
- Cliente HTTP: `src/core/api/client.ts`
- Mapeo de filtros: `src/core/api/map-catalog-filters-to-query.ts`
