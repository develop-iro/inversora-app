# Release checklist — Inversora MVP

Use this checklist before tagging a preview or production mobile build.

## Environment

- [ ] `inversora-api` deployed to QA with PostgreSQL synced (`npm run sync:run`)
- [ ] `ASSISTANT_ENABLED=true` and OpenAI key configured in QA
- [ ] `npm run start:qa` in `invesora` with `EXPO_PUBLIC_API_URL` pointing to QA
- [ ] Confirm `allowMockFallback: false` surfaces show errors instead of silent mocks

## Functional smoke test

- [ ] Home: destacados, ranking, búsqueda SORA
- [ ] Learn: cuestionario → perfil → catálogo con filtros sugeridos
- [ ] Catálogo: búsqueda, filtros, ordenación (score / TER / rentab. 1 año)
- [ ] Ficha: score, gráfico, favorito, SORA
- [ ] Comparar: 2 fondos, banner de homogeneidad, SORA contextual
- [ ] Calculadora: 3 escenarios + modo fondo
- [ ] Favoritos: persistencia y comparar desde favoritos
- [ ] Legal: `/legal` accesible desde avisos

## Quality gates

- [ ] `npm run test:ci` passes in `invesora` (typecheck, lint, unit + script tests, Expo config)
- [ ] `npm run build:web:ci` (Metro Android bundle export) and `npm run verify:prebuild` pass locally before release
- [ ] `npm run test` passes in `inversora-api`
- [ ] Manual CORS check for Expo web if applicable
- [ ] GitHub Actions secret `EXPO_TOKEN` configured for EAS preview builds in CI

## EAS build

- [ ] CI job **EAS preview Android** passes on the release branch (or run manually)
- [ ] `eas build --profile preview` (QA) succeeds
- [ ] Install preview APK/IPA on physical device and repeat smoke test
- [ ] Privacy policy URL documented for store metadata (`/legal` in-app)
