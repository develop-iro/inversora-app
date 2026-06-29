import { useCallback, useEffect, useState } from 'react';

import type { CatalogFund } from '@/core/domain/catalog';
import {
  calculateCompoundInterest,
  DEFAULT_COMPOUND_INTEREST_INPUT,
  type CompoundInterestInput,
  type CompoundInterestResult,
} from '@/features/calculator/models/compound-interest.engine';
import {
  deriveIllustrativeFundRate,
  type IllustrativeFundRate,
} from '@/features/calculator/utils/derive-fund-illustrative-rate';
import { getFundByIsin } from '@/features/funds/services/get-fund-by-isin';

export type CalculatorMode = 'free' | 'fund';

export type UseCompoundInterestCalculatorResult = {
  mode: CalculatorMode;
  setMode: (mode: CalculatorMode) => void;
  input: CompoundInterestInput;
  updateInput: (patch: Partial<CompoundInterestInput>) => void;
  selectedFund: CatalogFund | null;
  fundRate: IllustrativeFundRate | null;
  isFundLoading: boolean;
  fundError: string | null;
  selectFund: (fund: CatalogFund) => Promise<void>;
  clearFund: () => void;
  result: CompoundInterestResult | null;
  hasCalculated: boolean;
  calculate: () => void;
  reset: () => void;
};

/**
 * Manages calculator form state, optional fund-based rate derivation, and results.
 *
 * @param initialIsin - Optional ISIN to pre-load when opening from a fund detail.
 */
export function useCompoundInterestCalculator(
  initialIsin?: string,
): UseCompoundInterestCalculatorResult {
  const [mode, setModeState] = useState<CalculatorMode>(
    initialIsin !== undefined && initialIsin.trim().length > 0 ? 'fund' : 'free',
  );
  const [input, setInput] = useState<CompoundInterestInput>(DEFAULT_COMPOUND_INTEREST_INPUT);
  const [selectedFund, setSelectedFund] = useState<CatalogFund | null>(null);
  const [fundRate, setFundRate] = useState<IllustrativeFundRate | null>(null);
  const [isFundLoading, setIsFundLoading] = useState(false);
  const [fundError, setFundError] = useState<string | null>(null);
  const [result, setResult] = useState<CompoundInterestResult | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const loadFund = useCallback(async (fund: CatalogFund) => {
    setSelectedFund(fund);
    setFundError(null);
    setIsFundLoading(true);

    try {
      const detail = await getFundByIsin(fund.isin);

      if (detail === null) {
        setFundRate(null);
        setFundError('No encontramos datos suficientes para simular este fondo.');
        return;
      }

      const derivedRate = deriveIllustrativeFundRate(detail);

      if (derivedRate === null) {
        setFundRate(null);
        setFundError('Este fondo no tiene histórico suficiente para estimar un tipo ilustrativo.');
        return;
      }

      setFundRate(derivedRate);
      setInput((current) => ({
        ...current,
        annualRatePercent: derivedRate.annualRatePercent,
      }));
    } catch {
      setFundRate(null);
      setFundError('No se pudo cargar la información del fondo seleccionado.');
    } finally {
      setIsFundLoading(false);
    }
  }, []);

  const selectFund = useCallback(
    async (fund: CatalogFund) => {
      setModeState('fund');
      await loadFund(fund);
    },
    [loadFund],
  );

  const clearFund = useCallback(() => {
    setSelectedFund(null);
    setFundRate(null);
    setFundError(null);
  }, []);

  const setMode = useCallback(
    (nextMode: CalculatorMode) => {
      setModeState(nextMode);

      if (nextMode === 'free') {
        clearFund();
      }
    },
    [clearFund],
  );

  const updateInput = useCallback((patch: Partial<CompoundInterestInput>) => {
    setInput((current) => ({ ...current, ...patch }));
    setHasCalculated(false);
  }, []);

  const calculate = useCallback(() => {
    const safeInput: CompoundInterestInput = {
      ...input,
      durationYears: Math.min(Math.max(Math.round(input.durationYears), 1), 40),
      initialBalance: Math.max(input.initialBalance, 0),
      periodicDeposit: Math.max(input.periodicDeposit, 0),
      annualRatePercent: Math.max(input.annualRatePercent, 0),
    };

    setResult(calculateCompoundInterest(safeInput));
    setHasCalculated(true);
  }, [input]);

  const reset = useCallback(() => {
    setInput(DEFAULT_COMPOUND_INTEREST_INPUT);
    setResult(null);
    setHasCalculated(false);
    clearFund();
    setModeState('free');
  }, [clearFund]);

  useEffect(() => {
    const normalizedIsin = initialIsin?.trim().toUpperCase();

    if (normalizedIsin === undefined || normalizedIsin.length === 0) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const detail = await getFundByIsin(normalizedIsin);

      if (cancelled || detail === null) {
        return;
      }

      await loadFund({
        ...detail.fund,
        inversoraScore: detail.inversoraScore,
        rank: detail.rank,
        catalogVisibility: 'visible',
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [initialIsin, loadFund]);

  return {
    mode,
    setMode,
    input,
    updateInput,
    selectedFund,
    fundRate,
    isFundLoading,
    fundError,
    selectFund,
    clearFund,
    result,
    hasCalculated,
    calculate,
    reset,
  };
}
