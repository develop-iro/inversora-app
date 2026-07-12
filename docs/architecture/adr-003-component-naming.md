# ADR-003: Convención de nombres y carpetas del design system

| Campo | Valor |
|-------|--------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-29 |
| **Contexto** | Headers, tabs y tipografía crecían con vocabularios distintos (`SegmentTabs`, `PillSegmentControl`, `ThemedText type="small"`) |

---

## Contexto

El repositorio acumulaba componentes de UI en `shared/components/ui/` sin una regla de nomenclatura común:

- Tabs con tres patrones visuales y tres nombres (`SegmentTabs`, `PillSegmentControl`, `TimeframeSegmentedControl`).
- Texto de párrafo solo vía `ThemedText` y presets `type` con aliases redundantes (`default`, `small`, `title`).
- Headers de pantalla, sección y app sin carpeta ni prefijo coherente.

Eso dificulta descubrir piezas, migrar pantallas y mantener consistencia visual.

---

## Decisión

### 1. Patrón de nombre de componente

```
TipoVariante[Categoria]
```

| Parte | Significado | Ejemplo |
|-------|-------------|---------|
| **Tipo** | Familia de UI | `Tab`, `Text`, `Header`, `Nav` |
| **Variante** | Estilo o rol dentro de la familia | `Header`, `Pill`, `Chip`, `Paragraph`, `Screen` |
| **Categoria** | Dominio o contexto — **solo si no basta con props genéricas** | `Fund`, `Home` |

- **Export React:** PascalCase (`TabHeaderFund`).
- **Archivos y carpetas:** kebab-case (`tab-header-fund.tsx`, `components/tabs/`).
- **Props y variants:** camelCase (`variant="emphasis"`, `variant="secondary"`).

### 2. Estructura de carpetas en `shared/components/`

```text
shared/components/
  text/           # TextParagraph, TextHeading, TextLabel, TextLegal (+ ThemedText primitivo)
  tabs/           # TabHeader, TabPill, TabChip
  headers/        # HeaderApp, HeaderScreen, HeaderSection
  inputs/         # InputField, InputNumeric, InputMessage
  carousels/      # CarouselDots, CarouselShell, useCarouselAutoplay
  navigation/     # NavTabBar (tab bar inferior)
  layout/         # ScreenShell, ScreenBody (estructura de página)
  ui/             # Átomos sin familia clara (Button, Badge, Card) — sin nuevos tabs/text aquí
core/forms/       # validateWithSchema, mapZodFieldErrors (validación compartida)
```

Las **categorías de dominio** viven en `features/<feature>/components/<familia>/` cuando el preset no es reutilizable:

```text
features/funds/components/tabs/tab-chip-fund.tsx  → TabChipFund
```

### 3. Mapeo inicial (legacy → canónico)

| Legacy | Canónico | Ubicación |
|--------|----------|-----------|
| `SegmentTabs` | `TabHeader` | `shared/components/tabs/` |
| `PillSegmentControl` | `TabPill` | `shared/components/tabs/` |
| `TimeframeSegmentedControl` | `TabChipFund` | `features/funds/components/tabs/` |
| `ThemedText type="body"` / `"default"` | `TextParagraph variant="default"` | `shared/components/text/` |
| `ThemedText type="bodyBold"` | `TextParagraph variant="emphasis"` | `shared/components/text/` |
| `ThemedText type="caption"` (párrafo secundario) | `TextParagraph variant="secondary"` | `shared/components/text/` |
| `ThemedText type="sectionTitle"` | `TextHeading variant="section"` | `shared/components/text/` |
| `ThemedText type="navTitle"` | `TextHeading variant="nav"` | `shared/components/text/` |
| `AppHeaderBar` | `HeaderApp` | `shared/components/headers/` |
| `HomeSectionHeader` | `HeaderSection` | `shared/components/headers/` |
| `CalculatorNumericField` | `InputNumeric` | `shared/components/inputs/` |
| `MediaCard` (sin uso) | — | eliminado de `ui/card.tsx` |
| `FloatingTabBar` | `NavTabBar` | `shared/components/navigation/` |
| `FundCard` | `CardFund` | `features/funds/components/` |
| `FundCardIcon` (onboarding) | `FundCardIcon` | `features/funds/components/` |

Los nombres legacy se migran directamente a los canónicos; no se mantienen re-exports de compatibilidad.

### 4. Cuándo usar cada tab

| Componente | Uso |
|------------|-----|
| `TabHeader` | Secciones con etiqueta + subrayado (catálogo, calculadora, detalle de fondo) |
| `TabPill` | Conmutador compacto 2–N opciones en píldora (home Explorar / Rankings) |
| `TabChip` | Chips horizontales en track suave (genérico) |
| `TabChipFund` | Preset de periodos del gráfico de rendimiento |

### 5. API de texto

`ThemedText` sigue siendo el **primitivo interno**. La API pública semántica es:

```tsx
<TextParagraph variant="default">...</TextParagraph>
<TextParagraph variant="emphasis">...</TextParagraph>
<TextParagraph variant="secondary" themeColor="textSecondary">...</TextParagraph>

<TextHeading variant="section">Rentabilidad</TextHeading>
<TextHeading variant="nav">Detalle del fondo</TextHeading>
<TextHeading variant="card">Nombre del fondo</TextHeading>
<TextHeading variant="hero">92</TextHeading>

<TextLabel variant="meta" themeColor="textSecondary">TER</TextLabel>
<TextLabel variant="listMeta" themeColor="textSecondary">Temática</TextLabel>
<TextLabel variant="chip">#1</TextLabel>

<TextLegal themeColor="textSecondary">Aviso legal educativo.</TextLegal>
```

| Legacy `ThemedText` | Canónico |
|---------------------|----------|
| `type="body"` / `"default"` | `TextParagraph variant="default"` |
| `type="bodyBold"` | `TextParagraph variant="emphasis"` |
| `type="caption"` (secundario) | `TextParagraph variant="secondary"` |
| `type="sectionTitle"` | `TextHeading variant="section"` |
| `type="navTitle"` | `TextHeading variant="nav"` |
| `type="cardTitle"` | `TextHeading variant="card"` |
| `type="scoreHero"` | `TextHeading variant="hero"` |
| `type="metaLabel"` | `TextLabel variant="meta"` |
| `type="listMeta"` | `TextLabel variant="listMeta"` |
| `type="chip"` | `TextLabel variant="chip"` |
| `type="legal"` | `TextLegal` |
| `type="linkPrimary"` | `TextParagraph variant="secondary" themeColor="primary"` |

No se añaden nuevos aliases en `ThemedTextType` (`small`, `title`, `subtitle` quedan congelados).

### 6. Headers (`shared/components/headers/`)

| Preset | Uso | Acciones típicas |
|--------|-----|------------------|
| `HeaderApp` | Dashboard / tabs (`_layout.tsx`) | `learn` (caption), opcional `sora` |
| `HeaderScreen` / `HeaderModal` | Stack y modales | `back`, `close`, `learn`, `sora` |
| `HeaderSection` | Títulos dentro del scroll (secciones en cards) | — |

Acciones declarativas con `leadingActions` / `trailingActions` y handlers en `onAction`:

```tsx
<HeaderScreen
  title="Detalle del fondo"
  leadingActions={['back']}
  trailingActions={['sora']}
  onAction={{
    back: () => router.back(),
    sora: () => setSoraVisible(true),
  }}
/>
```

`HeaderActionId`: `back` | `close` | `learn` | `sora`. `close` y `sora` requieren handler explícito salvo en modales con `onAction.close`.

Acciones textuales en toolbar (p. ej. «Omitir»): `HeaderTextAction` en el slot `trailing` de `HeaderBar`, no como `HeaderActionId`.

### 7. Inputs (`shared/components/inputs/`)

| Componente | Uso |
|------------|-----|
| `InputField` | Texto genérico con label, hint y estado de error |
| `InputNumeric` | Entrada numérica localizada (coma/punto) con label y error |
| `InputMessage` | Mensaje de ayuda o error debajo del campo |

Utilidades: `parseLocalizedNumber`, `formatLocalizedDecimal`, `InputVariant`.

Los esquemas Zod viven en `features/<feature>/schemas/`; la validación compartida en `core/forms/validate-with-schema.ts`.

### 8. Carousels (`shared/components/carousels/`)

| Componente | Uso |
|------------|-----|
| `CarouselDots` | Indicadores de página con animación opcional (`animateScale`) |
| `CarouselShell` | Carrusel paginado con autoplay y dots (hero) |
| `CarouselNavButton` | Flechas laterales del carrusel |
| `useCarouselAutoplay` | Autoplay, pausa y sync de índice compartido |
| `useCarouselDotProgress` | Hook de progreso por dot (animación manual) |

### 9. Navegación (`shared/components/navigation/`)

| Componente | Uso |
|------------|-----|
| `NavTabBar` | Tab bar inferior flotante del dashboard |

Constantes: `NAV_TAB_BAR_HEIGHT`, `NAV_TAB_BAR_BOTTOM_GAP`, `NAV_TAB_BAR_CONTENT_GAP`.

---

## Consecuencias

### Positivas

- Descubrimiento por carpeta (`tabs/`, `text/`).
- Nombres autodescriptivos y extensibles (`TabHeaderFund` solo cuando hace falta).
- Migración incremental: los nombres legacy se sustituyen directamente; no se mantienen re-exports de compatibilidad.

### Negativas / deuda

- Pantallas antiguas pueden seguir usando `ThemedText` solo para tokens sin preset semántico (`iconSymbolSm`, `iconSymbolMd`). Las superficies principales migran a `TextParagraph`, `TextHeading`, `TextLabel` y `TextLegal`.

---

## Referencias

- [adr-001-domain-boundaries.md](./adr-001-domain-boundaries.md)
- `src/shared/components/tabs/`
- `src/shared/components/text/`
- `src/shared/components/inputs/`
- `src/shared/components/carousels/`
- `src/core/forms/validate-with-schema.ts`
