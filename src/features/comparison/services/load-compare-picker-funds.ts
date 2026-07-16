import {
  allowsMockFallback,
  shouldUseMockData,
} from '@/core/config/app-environment';
import { createComparePickerFundsService } from '@/features/comparison/services/load-compare-picker-funds.factory';
import {
  getFundsPage,
  searchCatalogFunds,
} from '@/features/funds/services/get-funds';

export { matchesComparePickerSearch } from '@/features/comparison/services/load-compare-picker-funds.factory';

const comparePickerFundsService = createComparePickerFundsService({
  shouldUseMockData,
  allowsMockFallback,
  getFundsPage,
  searchCatalogFunds,
});

/**
 * Loads catalog funds for the compare picker with mock fallback when the API is empty or down.
 *
 * @param query - Optional search text.
 * @param options - Optional abort signal and result limit.
 */
export const loadComparePickerFunds = comparePickerFundsService.loadComparePickerFunds;
