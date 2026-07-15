import { useCallback, useEffect, useState } from 'react';

import {
  compareSelectionStore,
  subscribeCompareSelection,
} from '@/core/storage/compare-selection-store';
import { MAX_COMPARE_FUNDS } from '@/core/storage/compare-selection-storage-key';
import {
  STORAGE_READ_TIMEOUT_MS,
  withStorageTimeout,
} from '@/core/storage/with-storage-timeout';

function normalizeIsin(isin: string): string {
  return isin.trim().toUpperCase();
}

/**
 * Local compare selection persisted in secure storage.
 */
export function useCompareSelection() {
  const [selectedIsins, setSelectedIsins] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      void withStorageTimeout(
        compareSelectionStore.listSelectedIsins(),
        STORAGE_READ_TIMEOUT_MS,
        [],
      )
        .then((isins) => {
          if (!cancelled) {
            setSelectedIsins(isins);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setSelectedIsins([]);
            setIsLoading(false);
          }
        });
    };

    load();
    return subscribeCompareSelection(load);
  }, []);

  const addFund = useCallback(async (isin: string) => {
    const normalized = normalizeIsin(isin);

    setSelectedIsins((current) => {
      if (current.includes(normalized)) {
        return current;
      }

      return [...current, normalized].slice(0, MAX_COMPARE_FUNDS);
    });

    try {
      const next = await compareSelectionStore.addFund(isin);
      setSelectedIsins(next);
      return next;
    } catch {
      return [normalized].slice(0, MAX_COMPARE_FUNDS);
    }
  }, []);

  const removeFund = useCallback(async (isin: string) => {
    const normalized = normalizeIsin(isin);

    setSelectedIsins((current) => current.filter((item) => item !== normalized));

    try {
      const next = await compareSelectionStore.removeFund(isin);
      setSelectedIsins(next);
      return next;
    } catch {
      return [];
    }
  }, []);

  const setFunds = useCallback(async (isins: readonly string[]) => {
    const normalized = [
      ...new Set(isins.map(normalizeIsin).filter((isin) => isin.length > 0)),
    ].slice(0, MAX_COMPARE_FUNDS);

    setSelectedIsins(normalized);

    try {
      await compareSelectionStore.setSelectedIsins(normalized);
      const next = await compareSelectionStore.listSelectedIsins();
      setSelectedIsins(next);
      return next;
    } catch {
      return normalized;
    }
  }, []);

  const clear = useCallback(async () => {
    setSelectedIsins([]);

    try {
      await compareSelectionStore.clear();
    } catch {
      // Keep the optimistic empty selection when persistence fails.
    }
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
