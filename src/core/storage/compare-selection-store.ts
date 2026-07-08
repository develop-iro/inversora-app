import { AppError } from '@/core/errors/app-error';
import {
  COMPARE_SELECTION_STORAGE_KEY,
  MAX_COMPARE_FUNDS,
} from '@/core/storage/compare-selection-storage-key';
import {
  migrateLegacyAsyncStorageValue,
  readSecureValue,
  writeSecureValue,
} from '@/core/storage/secure-storage';

type CompareSelectionListener = () => void;

const listeners = new Set<CompareSelectionListener>();

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

function normalizeIsin(isin: string): string {
  return isin.trim().toUpperCase();
}

async function readSelection(): Promise<string[]> {
  await migrateLegacyAsyncStorageValue(COMPARE_SELECTION_STORAGE_KEY);
  const raw = await readSecureValue(COMPARE_SELECTION_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item): item is string => typeof item === 'string')
      .map(normalizeIsin)
      .slice(0, MAX_COMPARE_FUNDS);
  } catch {
    return [];
  }
}

async function writeSelection(isins: readonly string[]): Promise<void> {
  const unique = [...new Set(isins.map(normalizeIsin))].slice(0, MAX_COMPARE_FUNDS);
  await writeSecureValue(COMPARE_SELECTION_STORAGE_KEY, JSON.stringify(unique));
}

export function subscribeCompareSelection(listener: CompareSelectionListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const compareSelectionStore = {
  async listSelectedIsins(): Promise<string[]> {
    try {
      return await readSelection();
    } catch (cause) {
      throw new AppError(
        'STORAGE_READ_FAILED',
        'No se pudo leer la selección de comparación.',
        cause,
      );
    }
  },

  async setSelectedIsins(isins: readonly string[]): Promise<void> {
    try {
      await writeSelection(isins);
      notifyListeners();
    } catch (cause) {
      throw new AppError(
        'STORAGE_WRITE_FAILED',
        'No se pudo guardar la selección de comparación.',
        cause,
      );
    }
  },

  async addFund(isin: string): Promise<string[]> {
    const normalized = normalizeIsin(isin);
    const current = await readSelection();

    if (current.includes(normalized)) {
      return current;
    }

    const next = [...current, normalized].slice(0, MAX_COMPARE_FUNDS);
    await writeSelection(next);
    notifyListeners();
    return next;
  },

  async removeFund(isin: string): Promise<string[]> {
    const normalized = normalizeIsin(isin);
    const next = (await readSelection()).filter((item) => item !== normalized);
    await writeSelection(next);
    notifyListeners();
    return next;
  },

  async clear(): Promise<void> {
    await writeSelection([]);
    notifyListeners();
  },
};
