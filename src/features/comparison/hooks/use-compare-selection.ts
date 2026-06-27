import { useCallback, useEffect, useState } from 'react';

import {
  compareSelectionStore,
  subscribeCompareSelection,
} from '@/core/storage/compare-selection-store';
import { MAX_COMPARE_FUNDS } from '@/core/storage/compare-selection-storage-key';

/**
 * Local compare selection persisted in AsyncStorage.
 */
export function useCompareSelection() {
  const [selectedIsins, setSelectedIsins] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      compareSelectionStore.listSelectedIsins().then((isins) => {
        if (!cancelled) {
          setSelectedIsins(isins);
          setIsLoading(false);
        }
      });
    };

    load();
    return subscribeCompareSelection(load);
  }, []);

  const addFund = useCallback(async (isin: string) => {
    const next = await compareSelectionStore.addFund(isin);
    setSelectedIsins(next);
    return next;
  }, []);

  const removeFund = useCallback(async (isin: string) => {
    const next = await compareSelectionStore.removeFund(isin);
    setSelectedIsins(next);
    return next;
  }, []);

  const setFunds = useCallback(async (isins: readonly string[]) => {
    await compareSelectionStore.setSelectedIsins(isins);
    const next = await compareSelectionStore.listSelectedIsins();
    setSelectedIsins(next);
    return next;
  }, []);

  const clear = useCallback(async () => {
    await compareSelectionStore.clear();
    setSelectedIsins([]);
  }, []);

  return {
    selectedIsins,
    isLoading,
    canAddMore: selectedIsins.length < MAX_COMPARE_FUNDS,
    addFund,
    removeFund,
    setFunds,
    clear,
  };
}
