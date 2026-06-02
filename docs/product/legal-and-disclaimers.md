# Avisos legales y copy obligatorio

Inversora es **informativa y educativa**. Estos mensajes deben ser visibles en superficies sensibles (dashboard, destacados, rankings, ficha, comparación, calculadora, explicaciones IA).

## Mensajes nucleares

1. **No es asesoramiento financiero personalizado** (HU-38).
2. **El rendimiento pasado no garantiza resultados futuros** (HU-39).
3. **Toda inversión conlleva riesgo** de pérdida.
4. Los **datos dependen de fuentes externas** y deben mostrar **fecha de actualización**.
5. Guardar un **favorito no es una recomendación** de inversión.

## Dónde mostrarlos

| Superficie | Requisito |
|------------|-----------|
| Dashboard | Disclaimer global (implementado en home) |
| Fondos destacados | Aviso de no recomendación en la sección (HU-02) |
| Ranking / score | Contexto educativo; sin lenguaje de “mejor inversión” |
| Ficha de fondo | No asesoramiento + advertencias DQ si aplican |
| Rentabilidad histórica | Aviso HU-39 junto al dato |
| Comparador | Advertencia si comparación no homogénea (HU-27) |
| Calculadora | Escenarios ilustrativos, no promesa de rentabilidad |
| `/legal` | Textos completos centralizados (pendiente) |

## Lenguaje a evitar (asistente y UI)

- Imperativos de inversión: comprar, vender, suscribir, “debes invertir”.
- Garantías de rentabilidad o “sin riesgo”.
- Presentar el ranking como lista de “mejores fondos para ti”.

## Componentes previstos

- `shared/components/legal/legal-notice.tsx` — bloque reutilizable (ADR-001).
- Pantalla `features/legal` o `app/legal.tsx` para textos largos.

## Estado en el repo

- Disclaimer en `home-screen` — ✅ parcial.
- Ruta `/legal` y componente compartido — ⬜.

## Ver también

- [assistant.md](./assistant.md) — HU-40
- [mvp-scope.md](./mvp-scope.md)
