type NestedRouteState = {
  index?: number;
  routes?: { name: string }[];
};

type TabRoute = {
  name: string;
  state?: NestedRouteState;
};

const FUNDS_CATALOG_ROUTE = 'index';

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
