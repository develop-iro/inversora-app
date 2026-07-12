import type { Href, useNavigation, useRouter } from 'expo-router';

import {
  FUNDS_CATALOG_SCREEN,
  FUNDS_DETAIL_SCREEN,
  FUNDS_TAB_NAME,
} from '@/shared/navigation/tab-route-state';
import { getTabNavigation } from '@/shared/navigation/tab-navigation';

/** Screens that should return to their origin instead of stacking fund details. */
export type FundDetailReturnTo = 'home' | 'favorites' | 'rankings';

export type NavigateToFundDetailOptions = {
  returnTo?: FundDetailReturnTo;
};

type FundsStackNavigation = {
  getParent?: () => TabNavigation | undefined;
  reset: (state: unknown) => void;
  canGoBack?: () => boolean;
  goBack?: () => void;
};

export type FundDetailBackNavigation = FundsStackNavigation;

type TabNavigation = NonNullable<ReturnType<typeof getTabNavigation>>;

function normalizeFundIsin(isin: string): string {
  return isin.trim().toUpperCase();
}

function buildFundDetailParams(
  isin: string,
  returnTo?: FundDetailReturnTo,
): Record<string, string> {
  const normalizedIsin = normalizeFundIsin(isin);

  return returnTo
    ? { isin: normalizedIsin, returnTo }
    : { isin: normalizedIsin };
}

/**
 * Resets the funds tab stack to catalog + a single detail screen.
 */
export function openFundDetailWithReturnTo(
  tabNavigation: TabNavigation,
  isin: string,
  returnTo: FundDetailReturnTo,
): void {
  const normalizedIsin = normalizeFundIsin(isin);

  tabNavigation.navigate(FUNDS_TAB_NAME, {
    state: {
      index: 1,
      routes: [
        { name: FUNDS_CATALOG_SCREEN },
        {
          name: FUNDS_DETAIL_SCREEN,
          params: buildFundDetailParams(normalizedIsin, returnTo),
        },
      ],
    },
  });
}

/**
 * Clears fund-detail routes from the nested funds stack.
 */
export function resetFundsStackToCatalog(
  fundsStackNavigation: FundsStackNavigation,
): void {
  fundsStackNavigation.reset({
    index: 0,
    routes: [{ name: FUNDS_CATALOG_SCREEN }],
  });
}

/**
 * Navigates back from fund detail to the screen that opened it.
 */
export function navigateBackFromFundDetail(
  fundsStackNavigation: FundDetailBackNavigation,
  router: ReturnType<typeof useRouter>,
  returnTo: FundDetailReturnTo | undefined,
): void {
  if (returnTo === undefined) {
    if (fundsStackNavigation.canGoBack?.()) {
      fundsStackNavigation.goBack?.();
      return;
    }

    router.back();
    return;
  }

  resetFundsStackToCatalog(fundsStackNavigation);

  if (returnTo === 'home') {
    fundsStackNavigation.getParent?.()?.navigate('index');
    return;
  }

  if (returnTo === 'favorites') {
    fundsStackNavigation.getParent?.()?.navigate('favorites');
    return;
  }

  router.back();
}

/**
 * Opens fund detail, avoiding stacked detail screens when launched from another tab.
 */
export function navigateToFundDetail(
  navigation: ReturnType<typeof useNavigation>,
  router: ReturnType<typeof useRouter>,
  isin: string,
  options: NavigateToFundDetailOptions = {},
): void {
  const normalizedIsin = normalizeFundIsin(isin);
  const returnTo = options.returnTo;

  if (returnTo) {
    const tabNavigation = getTabNavigation(navigation);

    if (tabNavigation) {
      openFundDetailWithReturnTo(tabNavigation, normalizedIsin, returnTo);
      return;
    }
  }

  router.push({
    pathname: '/funds/[isin]',
    params: buildFundDetailParams(normalizedIsin, returnTo),
  } as Href);
}

/**
 * Parses the optional `returnTo` search param from fund detail routes.
 */
export function parseFundDetailReturnTo(
  value: string | string[] | undefined,
): FundDetailReturnTo | undefined {
  const raw = Array.isArray(value) ? value[0] : value;

  if (raw === 'home' || raw === 'favorites' || raw === 'rankings') {
    return raw;
  }

  return undefined;
}

export function fundDetailHref(
  isin: string,
  options?: NavigateToFundDetailOptions,
): Href {
  return {
    pathname: '/funds/[isin]',
    params: buildFundDetailParams(isin, options?.returnTo),
  } as Href;
}
