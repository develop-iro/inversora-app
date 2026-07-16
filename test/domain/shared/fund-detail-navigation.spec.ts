import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  navigateToFundDetail,
  openFundDetailWithReturnTo,
  parseFundDetailReturnTo,
} from '@/shared/navigation/fund-detail-navigation';
import {
  FUNDS_CATALOG_SCREEN,
  FUNDS_DETAIL_SCREEN,
  FUNDS_TAB_NAME,
} from '@/shared/navigation/tab-route-state';

describe('fund-detail-navigation', () => {
  describe('parseFundDetailReturnTo', () => {
    it('parses supported return targets', () => {
      assert.equal(parseFundDetailReturnTo('home'), 'home');
      assert.equal(parseFundDetailReturnTo('favorites'), 'favorites');
      assert.equal(parseFundDetailReturnTo('rankings'), 'rankings');
    });

    it('reads the first value from array params', () => {
      assert.equal(parseFundDetailReturnTo(['home', 'favorites']), 'home');
    });

    it('ignores unknown return targets', () => {
      assert.equal(parseFundDetailReturnTo('catalog'), undefined);
      assert.equal(parseFundDetailReturnTo(undefined), undefined);
    });
  });

  describe('openFundDetailWithReturnTo', () => {
    it('navigates to the funds tab with catalog and detail stack routes', () => {
      const calls: unknown[] = [];
      const tabNavigation = {
        navigate: (...args: unknown[]) => {
          calls.push(args);
        },
        reset: () => undefined,
      };

      openFundDetailWithReturnTo(tabNavigation, ' ie00b4l5y983 ', 'home');

      assert.deepEqual(calls, [
        [
          FUNDS_TAB_NAME,
          {
            state: {
              index: 1,
              routes: [
                { name: FUNDS_CATALOG_SCREEN },
                {
                  name: FUNDS_DETAIL_SCREEN,
                  params: { isin: 'IE00B4L5Y983', returnTo: 'home' },
                },
              ],
            },
          },
        ],
      ]);
    });
  });

  describe('navigateToFundDetail', () => {
    it('uses tab navigation when returnTo is provided', () => {
      const calls: unknown[] = [];
      const tabNavigation = {
        getState: () => ({ routeNames: ['index', 'funds', 'compare'] }),
        navigate: (...args: unknown[]) => {
          calls.push(args);
        },
        reset: () => undefined,
      };
      const navigation = {
        getState: () => ({ routeNames: ['index'] }),
        getParent: () => tabNavigation,
      };
      const router = {
        push: (...args: unknown[]) => {
          calls.push(['router.push', ...args]);
        },
      };

      navigateToFundDetail(
        navigation as never,
        router as never,
        'ie00b4l5y983',
        { returnTo: 'home' },
      );

      assert.equal(calls.length, 1);
      assert.equal(calls[0]?.[0], FUNDS_TAB_NAME);
      assert.equal(
        (calls[0]?.[1] as { state: { routes: { name: string }[] } }).state.routes[1]?.name,
        FUNDS_DETAIL_SCREEN,
      );
    });

    it('falls back to router.push when tab navigation is unavailable', () => {
      const calls: unknown[] = [];
      const navigation = {
        getState: () => ({ routeNames: ['index'] }),
        getParent: () => undefined,
      };
      const router = {
        push: (...args: unknown[]) => {
          calls.push(['router.push', ...args]);
        },
      };

      navigateToFundDetail(
        navigation as never,
        router as never,
        'ie00b4l5y983',
        { returnTo: 'rankings' },
      );

      assert.deepEqual(calls, [
        [
          'router.push',
          {
            pathname: '/funds/[isin]',
            params: { isin: 'IE00B4L5Y983', returnTo: 'rankings' },
          },
        ],
      ]);
    });
  });
});
