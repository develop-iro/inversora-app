# Decisiones de stack

Qué usa **este repositorio** frente a opciones mencionadas en el documento oficial. Si el doc oficial lista alternativas, aquí se fija la decisión del equipo para el MVP.

## Adoptado en el repo

| Capa | Decisión | Notas |
|------|----------|--------|
| Cliente | Expo SDK 56 + React Native 0.85 + React 19 | Mobile-first; web vía `react-native-web` |
| Lenguaje | TypeScript | |
| Navegación | Expo Router | Rutas en `src/app` |
| UI / estilo | **NativeWind v4** (Tailwind híbrido) + tokens en `shared/theme` | `className` por defecto; lista blanca StyleSheet para chrome/animaciones — ver [tailwind-stylesheet-whitelist.md](./tailwind-stylesheet-whitelist.md) |
| Fuentes | DM Sans, Nunito (`@expo-google-fonts`) | |
| Estado cliente | Zustand | Planificado; aún no en `package.json` |
| Validación | Zod | Planificado en boundaries API |
| Backend / API | **inversora-api** (NestJS + PostgreSQL + Prisma) | Repo hermano; ver `inversora-api/docs/` |
| Base de datos | PostgreSQL (gestionada o Docker local) | Vía Prisma en `inversora-api` |
| IA | OpenAI o Vercel AI SDK en **backend** | Nunca API key en cliente |
| Persistencia local | `core/storage` con **SecureStore** en iOS/Android y AsyncStorage en web | Migración automática desde AsyncStorage |
| Transporte API | HTTPS + plugin `with-ssl-pinning` en builds `pro` nativos | Ver `docs/security-hardening.md` en `inversora-api` |

## No adoptado (por ahora)

| Opción en doc oficial | Motivo |
|----------------------|--------|
| Tamagui | Theme + NativeWind cubren utilidades y componentes propios |
| Victory Native / react-native-svg-charts | Sin gráficas complejas en MVP actual |
| Next.js / NestJS como API principal | Supabase Edge Functions como camino único planificado | **Obsoleto:** NestJS en `inversora-api` es el backend oficial |
| Login / cuentas | Fuera de alcance MVP |

## Verificación local

```bash
npm install
npm start          # Expo dev
npm run web        # Web
npm run lint       # ESLint (obligatorio antes de merge)
npm run typecheck  # TypeScript
```

Documentación Expo: https://docs.expo.dev/versions/v56.0.0/

## Convención NativeWind (híbrido)

- **Por defecto:** `className` + tokens semánticos (`bg-background`, `bg-surface`, `text-text`, `gap-md`, `rounded-card`).
- **Lista blanca:** componentes en [tailwind-stylesheet-whitelist.md](./tailwind-stylesheet-whitelist.md) mantienen layout/animación en `StyleSheet`.
- Componer clases con `cn()` desde `@/shared/utils/cn`.
- Mapas de variantes en `src/shared/nativewind/theme-classes.ts`.
- **`style` inline** para excepciones puntuales. Ver [styling-exceptions.md](./styling-exceptions.md).
- **`useTheme()`** para iconos, `ActivityIndicator`, gráficos y APIs de terceros.
- MVP en tema claro (`userInterfaceStyle: light`).
- Tras cambiar tokens JSON, ejecutar `npm run generate:theme`.

## Ver también

- [README.md](../../README.md)
- [AGENTS.md](../../AGENTS.md)
- [mvp-feature-map.md](./mvp-feature-map.md)
