import { createCompareSelectionStore } from '@/core/storage/compare-selection-store.factory';
import { createSecureKeyValueStoragePort } from '@/core/storage/secure-key-value-storage-port';

export { createCompareSelectionStore } from '@/core/storage/compare-selection-store.factory';

const defaultCompareSelectionStore = createCompareSelectionStore(
  createSecureKeyValueStoragePort(),
);

export function subscribeCompareSelection(
  listener: Parameters<typeof defaultCompareSelectionStore.subscribe>[0],
): () => void {
  return defaultCompareSelectionStore.subscribe(listener);
}

export const compareSelectionStore = {
  listSelectedIsins: () => defaultCompareSelectionStore.listSelectedIsins(),
  setSelectedIsins: (isins: readonly string[]) =>
    defaultCompareSelectionStore.setSelectedIsins(isins),
  addFund: (isin: string) => defaultCompareSelectionStore.addFund(isin),
  removeFund: (isin: string) => defaultCompareSelectionStore.removeFund(isin),
  clear: () => defaultCompareSelectionStore.clear(),
};
