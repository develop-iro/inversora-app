import type { ThemeColor, TypographyToken } from '@/shared/theme/theme';

/** Tailwind classes for each typography token. */
export const typographyClassNames = {
  hero: 'font-display-bold text-hero',
  sectionTitle: 'font-display-bold text-sectionTitle',
  navTitle: 'font-display-bold text-navTitle',
  body: 'font-display text-body',
  bodyBold: 'font-display-bold text-bodyBold',
  button: 'font-display-bold text-button',
  caption: 'font-display text-caption',
  metaLabel: 'font-display-bold text-metaLabel uppercase',
  chip: 'font-display-bold text-chip',
  cardTitle: 'font-display-bold text-cardTitle',
  tab: 'font-display-bold text-tab',
  brandWordmark: 'font-brand-serif text-brandWordmark font-bold',
  brandWordmarkSplash: 'font-brand-serif text-brandWordmarkSplash font-bold',
  brandWordmarkCompact: 'font-brand-serif text-brandWordmarkCompact font-bold',
  brandSectionTitle: 'font-brand-serif text-brandSectionTitle font-bold',
  code: 'font-mono text-code font-medium',
  chartAxis: 'font-display text-chartAxis',
  chartLabel: 'font-display-bold text-chartLabel font-bold',
  micro: 'font-display-bold text-micro uppercase',
  captionDense: 'font-display text-captionDense',
  listMeta: 'font-display text-listMeta',
  scoreDisplay: 'font-display-bold text-scoreDisplay',
  scoreHero: 'font-display-bold text-scoreHero',
  scoreHeroCompact: 'font-display-bold text-scoreHeroCompact',
  tabLabel: 'font-display text-tabLabel font-medium',
  tabLabelActive: 'font-display-bold text-tabLabelActive font-bold',
  legal: 'font-display text-legal',
  segment: 'font-display-bold text-segment',
  inputNumeric: 'font-display text-inputNumeric',
  iconSymbolSm: 'font-display-bold text-iconSymbolSm',
  iconSymbolMd: 'font-display-bold text-iconSymbolMd',
} as const satisfies Record<TypographyToken, string>;

/** Legacy ThemedText type aliases mapped to typography classes. */
export const legacyTypographyClassNames = {
  default: typographyClassNames.body,
  title: typographyClassNames.hero,
  subtitle: typographyClassNames.sectionTitle,
  small: typographyClassNames.caption,
  smallBold: typographyClassNames.bodyBold,
  link: typographyClassNames.caption,
  linkPrimary: typographyClassNames.caption,
} as const;

/** Tailwind text color classes for semantic theme colors. */
export const themeColorClassNames = {
  primary: 'text-primary',
  deepOcean: 'text-deep-ocean',
  accentMint: 'text-accent-mint',
  accentLime: 'text-lime-accent',
  chartInterest: 'text-chart-interest-teal',
  warning: 'text-warning-soft',
  danger: 'text-danger-soft',
  warningMuted: 'text-warning-muted',
  dangerMuted: 'text-danger-muted',
  warningOnMuted: 'text-warning-on-muted',
  dangerOnMuted: 'text-danger-on-muted',
  statusBadgeBackground: 'text-status-badge-background',
  warningBadgeLabel: 'text-warning-badge-label',
  dangerBadgeLabel: 'text-danger-badge-label',
  success: 'text-success',
  background: 'text-background',
  backgroundSoft: 'text-background-soft',
  backgroundElement: 'text-background-element',
  backgroundSelected: 'text-background-selected',
  surface: 'text-surface',
  surfaceMuted: 'text-surface-muted',
  text: 'text-text',
  textSecondary: 'text-text-secondary',
  textOnPrimary: 'text-text-on-primary',
  textOnDark: 'text-text-on-dark',
  textOnDarkMuted: 'text-text-on-dark-muted',
  border: 'text-border',
  borderSubtle: 'text-border-subtle',
  tabActive: 'text-tab-active',
  tabInactive: 'text-tab-inactive',
  primarySurface: 'text-primary-surface',
  primarySurfaceSubtle: 'text-primary-surface-subtle',
  primaryBorder: 'text-primary-border',
  primaryBorderSubtle: 'text-primary-border-subtle',
  primaryBorderFaint: 'text-primary-border-faint',
  primaryIconSurface: 'text-primary-icon-surface',
  primaryAccent: 'text-primary-accent',
  softTealSurface: 'text-soft-teal-surface',
  softTealSurfaceMuted: 'text-soft-teal-surface-muted',
  softTealSurfaceFaint: 'text-soft-teal-surface-faint',
  accentMintSurface: 'text-accent-mint-surface',
  accentMintText: 'text-accent-mint-text',
  onPrimarySurface: 'text-on-primary-surface',
  onPrimarySurfaceStrong: 'text-on-primary-surface-strong',
  deepOceanSurfaceSubtle: 'text-deep-ocean-surface-subtle',
  warningBannerSurface: 'text-warning-banner-surface',
  warningBannerBorder: 'text-warning-banner-border',
  dangerBannerSurface: 'text-danger-banner-surface',
  dangerBannerBorder: 'text-danger-banner-border',
  chartAllocationFill: 'text-chart-allocation-fill',
  chartCrosshair: 'text-chart-crosshair',
  carouselDotInactive: 'text-carousel-dot-inactive',
  overlayScrim: 'text-overlay-scrim',
  overlayScrimHeavy: 'text-overlay-scrim-heavy',
  scrim: 'text-scrim',
  scrimSubtle: 'text-scrim-subtle',
  shadow: 'text-shadow',
  skeletonBone: 'text-skeleton-bone',
  skeletonBoneMuted: 'text-skeleton-bone-muted',
  skeletonPanelBorder: 'text-skeleton-panel-border',
  skeletonShimmerTransparent: 'text-skeleton-shimmer-transparent',
  skeletonShimmerHighlight: 'text-skeleton-shimmer-highlight',
  skeletonShimmerAccent: 'text-skeleton-shimmer-accent',
  skeletonShimmerShadow: 'text-skeleton-shimmer-shadow',
  skeletonShimmerDeep: 'text-skeleton-shimmer-deep',
} as const satisfies Record<ThemeColor, string>;

/** Button variant container classes. */
export const buttonVariantClassNames = {
  primary: 'bg-primary active:opacity-90',
  secondary: 'bg-background-soft',
  ghost: 'bg-transparent',
  outline: 'border border-border bg-transparent',
  onDark: 'bg-surface',
} as const;

/** Button variant label classes. */
export const buttonLabelClassNames = {
  primary: 'text-text-on-primary',
  secondary: 'text-text',
  ghost: 'text-primary',
  outline: 'text-text',
  onDark: 'text-text',
} as const;

/** Card variant classes. */
export const cardVariantClassNames = {
  elevated: 'bg-surface shadow-card',
  outlined: 'border border-border bg-surface',
  flat: 'bg-surface',
} as const;

/** Badge variant classes. */
export const badgeVariantClassNames = {
  soft: 'bg-surface-muted',
  muted: 'bg-surface-muted',
  warning: 'bg-surface-muted',
  danger: 'bg-surface-muted',
  mint: 'bg-surface-muted',
} as const;

export const badgeLabelClassNames = {
  soft: 'text-deep-ocean',
  muted: 'text-text',
  warning: 'text-warning-badge-label',
  danger: 'text-danger-badge-label',
  mint: 'text-deep-ocean',
} as const;
