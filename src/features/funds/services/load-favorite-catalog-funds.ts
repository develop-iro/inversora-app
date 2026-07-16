import { createFavoriteCatalogFundsService } from '@/features/funds/services/load-favorite-catalog-funds.factory';
import { getFundByIsin } from '@/features/funds/services/get-fund-by-isin';

const favoriteCatalogFundsService = createFavoriteCatalogFundsService({
  getFundByIsin,
});

/**
 * Loads catalog-shaped cards for favorite ISINs, preserving selection order.
 *
 * @param isins - Favorite ISINs in display order.
 * @param signal - Optional abort signal forwarded to each detail fetch.
 */
export const loadFavoriteCatalogFunds =
  favoriteCatalogFundsService.loadFavoriteCatalogFunds;
