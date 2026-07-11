/**
 * Components that must keep layout-critical styles in StyleSheet or inline `style`,
 * not Tailwind `className`, on animated or precision-native surfaces.
 *
 * See docs/architecture/tailwind-stylesheet-whitelist.md
 */

/** Relative path from `src/` for whitelist entries. */
export type StylesheetWhitelistEntry = {
  readonly path: string;
  readonly reason: string;
  readonly tailwindAllowed: 'shell-only' | 'static-wrapper-only' | 'none';
};

/**
 * Canonical whitelist. Update when adding a precision-native component.
 */
export const STYLESHEET_WHITELIST = [
  {
    path: 'shared/components/navigation/nav-tab-bar.tsx',
    reason: 'Animated icons/labels, equal flex slots, Android text metrics',
    tailwindAllowed: 'shell-only',
  },
  {
    path: 'shared/components/tabs/tab-pill.tsx',
    reason: 'Reanimated thumb + crossfade labels on measured segments',
    tailwindAllowed: 'shell-only',
  },
  {
    path: 'shared/components/ui/button.tsx',
    reason: 'Animated scale on press; ActivityIndicator color',
    tailwindAllowed: 'static-wrapper-only',
  },
  {
    path: 'shared/components/ui/content-empty-state.tsx',
    reason: 'Empty-state column uses a fixed max content width',
    tailwindAllowed: 'static-wrapper-only',
  },
  {
    path: 'shared/components/ui/reload-state.tsx',
    reason: 'Screen layout centers a fixed-width action column',
    tailwindAllowed: 'static-wrapper-only',
  },
  {
    path: 'shared/components/ui/status-icon.tsx',
    reason: 'SVG viewport geometry for generic status glyphs',
    tailwindAllowed: 'static-wrapper-only',
  },
  {
    path: 'shared/components/ui/skeleton-bone.tsx',
    reason: 'Shimmer Reanimated translate',
    tailwindAllowed: 'static-wrapper-only',
  },
  {
    path: 'shared/components/carousels/carousel-shell.tsx',
    reason: 'Measured viewport width, horizontal paging geometry',
    tailwindAllowed: 'static-wrapper-only',
  },
  {
    path: 'shared/components/carousels/carousel-dots.tsx',
    reason: 'Animated dot width/scale/color',
    tailwindAllowed: 'static-wrapper-only',
  },
  {
    path: 'shared/components/ui/search/aurora-border.tsx',
    reason: 'Animated gradient border sweep',
    tailwindAllowed: 'none',
  },
  {
    path: 'shared/components/ui/search/animated-placeholder.tsx',
    reason: 'Animated placeholder crossfade',
    tailwindAllowed: 'static-wrapper-only',
  },
  {
    path: 'shared/components/ui/search/search-orb.tsx',
    reason: 'Reanimated orb pulse/scale',
    tailwindAllowed: 'static-wrapper-only',
  },
  {
    path: 'shared/components/brand/app-launch-splash.tsx',
    reason: 'Splash opacity fade',
    tailwindAllowed: 'static-wrapper-only',
  },
  {
    path: 'features/calculator/components/calculator-breakdown-donut.tsx',
    reason: 'SVG donut geometry and dynamic segment colors',
    tailwindAllowed: 'static-wrapper-only',
  },
  {
    path: 'features/funds/components/fund-performance-chart.tsx',
    reason: 'Dynamic bar geometry',
    tailwindAllowed: 'static-wrapper-only',
  },
  {
    path: 'features/funds/components/card-fund.tsx',
    reason: 'Animated scale on press/hover',
    tailwindAllowed: 'static-wrapper-only',
  },
] as const satisfies readonly StylesheetWhitelistEntry[];

/** Returns true when a source path is on the StyleSheet whitelist. */
export function isStylesheetWhitelistPath(sourcePath: string): boolean {
  const normalized = sourcePath.replace(/\\/g, '/');

  return STYLESHEET_WHITELIST.some(
    (entry) =>
      normalized.endsWith(entry.path) || normalized.includes(`/src/${entry.path}`),
  );
}
