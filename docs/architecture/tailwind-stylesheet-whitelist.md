# Lista blanca: StyleSheet vs Tailwind

Inversora usa un **modelo híbrido**: Tailwind (`className`) por defecto, `StyleSheet` / `style` en componentes de precisión nativa.

Fuente de verdad en código: `src/shared/nativewind/stylesheet-whitelist.ts`.

## Regla rápida

| Pregunta | Acción |
|----------|--------|
| ¿`View`/`Text` estático sin animación? | `className` + tokens semánticos |
| ¿`Animated.Text` o texto con `position: absolute`? | `Typography` en `StyleSheet`, sin `className` en el texto animado |
| ¿Reanimated / `Animated` con transform? | Contenedor en Tailwind; movimiento en `style` |
| ¿Layout medido (`onLayout`, paging, thumb)? | Geometría en `style`; shell visual en Tailwind |
| ¿Icono / chart / `TextInput` / gradiente? | Prop `color`/`style` del tercero |

## Lista blanca (no migrar a Tailwind completo)

| Componente | Tailwind permitido | Motivo |
|------------|-------------------|--------|
| `nav-tab-bar.tsx` | Solo shell (fondo, borde, sombra) | Iconos/labels animados, slots `flex` iguales, ellipsis |
| `tab-pill.tsx` | Solo track exterior | Thumb Reanimated + labels crossfade medidos |
| `button.tsx` | Variantes estáticas del `Pressable` | Scale animado en press |
| `content-empty-state.tsx` | Layout estático del card | Órbita/flotación animada |
| `reload-state.tsx` | Layout estático | Columna de acción con ancho fijo |
| `status-icon.tsx` | Wrapper estático | Viewport SVG de iconos de estado |
| `skeleton-bone.tsx` | Caja del hueso | Shimmer Reanimated |
| `carousel-shell.tsx` | Wrapper/padding | Ancho de viewport y paging |
| `carousel-dots.tsx` | Fila de dots | Ancho/escala/color animados |
| `search/aurora-border.tsx` | — | Borde animado |
| `search/animated-placeholder.tsx` | Campo estático | Placeholder crossfade |
| `search/search-orb.tsx` | Contenedor | Pulso del orb |
| `app-launch-splash.tsx` | Contenido estático | Fade de opacidad |
| `calculator-breakdown-donut.tsx` | Leyenda / contenedor | Segmentos SVG y swatches dinámicos |
| `fund-performance-chart.tsx` | Leyenda/ejes | Barras con altura dinámica |
| `card-fund.tsx` | Card estática | Scale en press/hover |
| `home-starter-card.tsx` | Shell del panel | Alturas fijas ilustración + título |
| `home-starter-illustration.tsx` | Contenedor | SVG animado y barras del podio |

## Cómo añadir una excepción

1. Comprobar que el fallo no se resuelve con `style` puntual (sin `StyleSheet` completo).
2. Añadir entrada en `stylesheet-whitelist.ts`.
3. Documentar en [styling-exceptions.md](./styling-exceptions.md).
4. Marcar el archivo con `// tailwind-exception:` en cada `style`/`StyleSheet` no obvio.

## Qué no hacer

- No migrar `Animated.Text` a `className` (provoca ellipsis y desalineación).
- No usar `dark` / `useColorScheme` del sistema hasta diseñar dark mode (MVP = claro).
- No poner layout crítico solo en utilidades Tailwind en web sin probar en iOS/Android.

## Ver también

- [styling-exceptions.md](./styling-exceptions.md)
- [stack-decisions.md](./stack-decisions.md)
