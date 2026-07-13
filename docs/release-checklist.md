# Release checklist — Inversora MVP

Use this checklist before tagging a preview or production mobile build.

## Environment

- [ ] `inversora-api` deployed to QA with PostgreSQL synced (`npm run sync:run`)
- [ ] `ASSISTANT_ENABLED=true` and OpenAI key configured in QA
- [ ] `pnpm run start:qa` in `invesora` with `EXPO_PUBLIC_API_URL` pointing to QA
- [ ] Confirm `allowMockFallback: false` surfaces show errors instead of silent mocks

## Functional smoke test

### Native (iOS / Android)

- [ ] Primera visita: redirección a `/learn?mode=initial` (gate obligatorio)
- [ ] Bienvenida initial: «Omitir» visible arriba a la derecha; footer sin botón ghost duplicado
- [ ] Omitir → home con acceso a tabs; segunda visita sin re-gate
- [ ] `/legal` accesible durante el gate sin perfil
- [ ] Learn: cuestionario → perfil → catálogo con filtros sugeridos

### Web

- [ ] Primera visita: aterriza en `/` sin gate
- [ ] Banner «Aprende con contexto» visible sin perfil; CTA abre `/learn` voluntario
- [ ] Learn: cuestionario → perfil → catálogo con filtros sugeridos

### Todas las plataformas

- [ ] Home: destacados, ranking, búsqueda SORA
- [ ] Catálogo: búsqueda, filtros, ordenación (score / TER / rentab. 1 año)
- [ ] Catálogo: el sheet de filtros actualiza `Ver N fondos` antes de aplicar cambios
- [ ] Ficha: score, gráfico, favorito, SORA
- [ ] Comparar: 2 fondos, banner de homogeneidad, SORA contextual
- [ ] Calculadora: 3 escenarios + modo fondo
- [ ] Favoritos: persistencia y comparar desde favoritos
- [ ] Legal: `/legal` accesible desde avisos

## Quality gates

- [ ] `pnpm run test:ci` passes in `invesora` (typecheck, lint, unit + script tests, Expo config)
- [ ] `pnpm run build:web:ci` (Metro Android bundle export) and `pnpm run verify:prebuild` pass locally before release
- [ ] `npm run test` passes in `inversora-api`
- [ ] Manual CORS check for Expo web if applicable
- [ ] GitHub Actions secret `EXPO_TOKEN` configured for EAS preview builds in CI

## EAS build

- [ ] CI job **EAS preview Android** passes on the release branch (or run manually)
- [ ] `eas build --profile preview` (QA) succeeds
- [ ] Install preview APK/IPA on physical device and repeat smoke test
- [ ] Privacy policy URL live and reachable: `https://inversora--inversora.expo.app/privacidad.html` (deploy with `pnpm run deploy:web:pro`; override via `EXPO_PUBLIC_PRIVACY_POLICY_URL` if using a custom domain)
- [ ] **Production only:** set `SENTRY_AUTH_TOKEN` (and org/project in app config) in EAS secrets so source maps upload; preview/dev builds skip upload via `SENTRY_DISABLE_AUTO_UPLOAD`
