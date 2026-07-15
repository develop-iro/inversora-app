# Excepciones de estilo Tailwind

Inversora usa un **modelo híbrido**: Tailwind (`className`) por defecto; `StyleSheet` / `style` en componentes de precisión nativa.

**Lista blanca canónica:** [tailwind-stylesheet-whitelist.md](./tailwind-stylesheet-whitelist.md) · `src/shared/nativewind/stylesheet-whitelist.ts`

El resto de la UI usa `className` con tokens semánticos (`bg-surface`, `text-text-secondary`, `border-border`, etc.).

Cuando NativeWind no basta, documentar con `// tailwind-exception: <motivo>`.

## Tipos de excepción

| Tipo | Motivo | Resolución |
|------|--------|------------|
| **A — Limitación nativa** | Sombras complejas en iOS/Android | `style` solo para `shadow*` / `elevation` si `shadow-*` no traduce bien |
| **B — Animación** | `Animated` / Reanimated | Wrapper con `style={{ transform }}`; visual estático en Tailwind |
| **C — Pressable dinámico** | Fondos que cambian en press con colores runtime | Probar `active:bg-*`; si falla, excepción puntual |
| **D — Layout dinámico** | Gráficos, barras con width %, dimensiones calculadas | Contenedor en Tailwind; `style` solo para valores calculados |
| **E — Safe area / insets** | `paddingBottom: insets.bottom` | `style` inline (valor runtime, no diseño) |
| **F — APIs de terceros** | `MaterialCommunityIcons color`, `TextInput`, `ActivityIndicator`, `LinearGradient` | Prop `color`/`style` donde `className` no aplica |

## Componentes con excepciones conocidas

| Componente | Tipo | Detalle |
|------------|------|---------|
| `button.tsx` | B, F | `Animated.View` scale; `ActivityIndicator` color |
| `content-empty-state.tsx` | B, F | Animaciones orbit/float; icon color |
| `reload-state.tsx` | D | Columna centrada con ancho fijo |
| `status-icon.tsx` | D, F | Viewport SVG; color de icono |
| `screen-shell.tsx` | E | Safe-area bottom inset |
| `nav-tab-bar.tsx` | B, F | StyleSheet para layout/iconos/labels animados; `className` solo en el shell de la barra |
| `search-field.tsx` | F | `TextInput` cursor/selection colors |
| `skeleton-bone.tsx` | B | Shimmer Reanimated |
| `fund-performance-chart.tsx` | D | Barras con width dinámico |
| `calculator-breakdown-donut.tsx` | D | Segmentos SVG del donut |
| `tab-pill.tsx` | B | StyleSheet en labels animados; `className` solo en track/thumb shell |
| `home-hero-slide-card.tsx` | D | Altura fija del strip de ilustración |
| `home-starter-card.tsx` | D | Alturas fijas del panel portrait |
| `home-starter-illustration.tsx` | B, D | SVG animado y geometría del podio |
| `learn-welcome-intro.tsx` | B, D | Entrada Reanimated de ilustración; altura fija |
| `learn-welcome-typewriter-text.tsx` | B | Tipografía medida + caret con opacidad animada |
| `legal-notice.tsx` | F | Icon `color` prop |

## Reglas para nuevas excepciones

1. Agregar comentario `// tailwind-exception: <motivo>` en el código.
2. Registrar el componente en esta tabla en el mismo PR.
3. Preferir tokens semánticos (`bg-surface`) antes que valores arbitrarios (`bg-[#fff]`).
4. No usar `StyleSheet.create` para estilos visuales nuevos, salvo layout nativo de precisión (tab bar, animaciones, medición de texto).

## Enfoque híbrido (recomendado)

- **Tailwind (`className`)**: pantallas, cards, listas, spacing, colores semánticos en componentes estáticos.
- **StyleSheet / `style`**: componentes con Reanimated, posicionamiento absoluto, tipografía en `Animated.Text`, o APIs que NativeWind no traduce bien en las tres plataformas.
- **Tokens compartidos**: ambos caminos leen `Typography`, `Spacing` y `semanticColors` desde `shared/theme`; no duplicar valores hex sueltos.

## Dark mode

- MVP fuerza tema claro (`userInterfaceStyle: light`, `useColorScheme()` → `'light'`).
- Variables `.dark` en `global.css` quedan preparadas para una fase posterior.

## Ver también

- [tailwind-stylesheet-whitelist.md](./tailwind-stylesheet-whitelist.md)
- `src/shared/nativewind/theme-classes.ts` — mapas de variantes
- `scripts/generate-global-css.mjs` — generador de variables CSS
