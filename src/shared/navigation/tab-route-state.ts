type NestedRouteState = {
  index?: number;
  routes?: { name: string }[];
};

type TabRoute = {
  name: string;
  state?: NestedRouteState;
};

/** Nested stack screen name for the fund catalog (`/funds`). */
export const FUNDS_CATALOG_SCREEN = 'index';

/** Nested stack screen name for fund detail (`/funds/[isin]`). */
export const FUNDS_DETAIL_SCREEN = '[isin]';

/** Top-level tab route name for the funds stack. */
export const FUNDS_TAB_NAME = 'funds';

const FUNDS_CATALOG_ROUTE = FUNDS_CATALOG_SCREEN;

/** Expo Router uses the real ISIN as the nested route name, not `[isin]`. */
export function isFundsStackDetailRoute(routeName: string | undefined): boolean {
  return routeName != null && routeName !== FUNDS_CATALOG_ROUTE;
}

export function getFocusedNestedRouteName(tabRoute: TabRoute): string | undefined {
  const nested = tabRoute.state;
  if (!nested?.routes?.length) {
    return undefined;
  }

  const nestedIndex = nested.index ?? 0;
  return nested.routes[nestedIndex]?.name;
}

/** Mirrors `getFocusedRouteNameFromRoute` for nested tab stacks (e.g. funds → ISIN). */
export function getFocusedRouteNameFromTabRoute(tabRoute: TabRoute): string | undefined {
  const nestedName = getFocusedNestedRouteName(tabRoute);
  if (nestedName) {
    return nestedName;
  }

  return tabRoute.name === 'funds' ? FUNDS_CATALOG_ROUTE : tabRoute.name;
}

/** Path-based check for `/funds/{isin}` (reactive with `useSegments`). */
export function isFundDetailPath(segments: readonly string[]): boolean {
  const fundsIndex = segments.indexOf('funds');
  if (fundsIndex === -1) {
    return false;
  }

  const nestedSegment = segments[fundsIndex + 1];
  return isFundsStackDetailRoute(nestedSegment);
}

/** Path-based check for `/learn` (reactive with `useSegments`). */
export function isLearnPath(segments: readonly string[]): boolean {
  return segments.includes('learn');
}

/** Path-based check for `/legal` (reactive with `useSegments`). */
export function isLegalPath(segments: readonly string[]): boolean {
  return segments.includes('legal');
}

/** Tab navigation target that always opens the fund catalog. */
export function createFundsCatalogTabParams(): { screen: typeof FUNDS_CATALOG_SCREEN } {
  return { screen: FUNDS_CATALOG_SCREEN };
}
