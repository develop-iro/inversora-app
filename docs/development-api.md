# Desarrollo con la API local

Guía para conectar la app Expo (`invesora`) al backend NestJS (`inversora-api`) en entorno de desarrollo.

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

En `invesora`:

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

## 3. Endpoints usados en dev

| Pantalla | Servicio | Endpoint |
|----------|----------|----------|
| Inicio (carrusel) | `getFeaturedFunds` | `GET /featured` |
| Catálogo | `getCatalogFunds` | `GET /funds` (paginado) |
| Ficha por ISIN | `getFundByIsin` | `GET /funds/:isin` |

No se requiere autenticación en las rutas públicas del MVP.

## 4. Recorrido manual de verificación

1. Abre la app y confirma que el carrusel de destacados carga (o queda vacío sin romper la pantalla).
2. Navega a **Catálogo** y espera la carga inicial.
3. Abre una ficha desde una tarjeta del catálogo.
4. Compara nombre, ISIN, score y TER con la respuesta de la API:

```bash
curl "http://localhost:3000/funds/US78462F1030"
```

5. Desconecta el backend y comprueba que Catálogo y Ficha muestran error con opción de reintentar sin bloquear la navegación.

## 5. Problemas frecuentes

| Síntoma | Causa probable | Acción |
|---------|----------------|--------|
| "No se pudo conectar con la API" | URL incorrecta o backend apagado | Revisa `EXPO_PUBLIC_API_URL` y `npm run start:dev` |
| Catálogo vacío sin error | Sin fondos `visible` en BD | Ejecuta sync/admin en el backend |
| Ficha 404 | ISIN inexistente o fondo no visible | Usa un ISIN del catálogo o revisa visibilidad |
| Cambios en `.env` no aplican | Metro en caché | Detén Expo y vuelve a `npm start` |

## Referencias

- Contrato BFF ficha: [inversora-api/docs/bff-fund-detail-contract.md](../../inversora-api/docs/bff-fund-detail-contract.md)
- Cliente HTTP: `src/core/api/client.ts`
- Servicios de fondos: `src/features/funds/services/`
