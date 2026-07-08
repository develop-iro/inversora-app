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

- [ ] `npm run quality` passes in `invesora` (typecheck + lint + unit tests)
- [ ] `npm run test` passes in `inversora-api`
- [ ] Manual CORS check for Expo web if applicable

## EAS build

- [ ] `eas build --profile preview` (QA) succeeds
- [ ] Install preview APK/IPA on physical device and repeat smoke test
- [ ] Privacy policy URL documented for store metadata (`/legal` in-app)
