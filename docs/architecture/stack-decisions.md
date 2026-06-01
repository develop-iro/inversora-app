# Decisiones de stack

Qué usa **este repositorio** frente a opciones mencionadas en el documento oficial. Si el doc oficial lista alternativas, aquí se fija la decisión del equipo para el MVP.

## Adoptado en el repo

| Capa | Decisión | Notas |
|------|----------|--------|
| Cliente | Expo SDK 56 + React Native 0.85 + React 19 | Mobile-first; web vía `react-native-web` |
| Lenguaje | TypeScript | |
| Navegación | Expo Router | Rutas en `src/app` |
| UI / estilo | Theme propio en `shared/theme` | Componentes en `shared/components/ui` |
| Fuentes | DM Sans, Nunito (`@expo-google-fonts`) | |
| Estado cliente | Zustand | Planificado; aún no en `package.json` |
| Validación | Zod | Planificado en boundaries API |
| Backend | Supabase (PostgreSQL + Edge Functions) | Planificado |
| IA | OpenAI o Vercel AI SDK en **backend** | Nunca API key en cliente |
| Persistencia local | `core/storage` (favoritos, perfil) | Stub / AsyncStorage o SecureStore |

## No adoptado (por ahora)

| Opción en doc oficial | Motivo |
|----------------------|--------|
| NativeWind / Tamagui | Theme y componentes propios ya iniciados |
| Victory Native / react-native-svg-charts | Sin gráficas complejas en MVP actual |
| Next.js / NestJS como API principal | Supabase Edge Functions como camino único planificado |
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

## Ver también

- [README.md](../../README.md)
- [AGENTS.md](../../AGENTS.md)
- [mvp-feature-map.md](./mvp-feature-map.md)
