import { useCallback, useEffect, useState } from 'react';

import type { CatalogFund } from '@/core/domain/catalog';
import { validateWithSchema } from '@/core/forms/validate-with-schema';
import { trackEvent } from '@/core/analytics/track-event';
import {
  calculateCompoundInterest,
  DEFAULT_COMPOUND_INTEREST_INPUT,
  type CompoundInterestInput,
  type CompoundInterestResult,
} from '@/features/calculator/models/compound-interest.engine';
import { compoundInterestInputSchema } from '@/features/calculator/schemas/compound-interest-input.schema';
import {
  deriveIllustrativeFundRate,
  type IllustrativeFundRate,
} from '@/features/calculator/utils/derive-fund-illustrative-rate';
import {
  EDUCATIONAL_RATE_SCENARIOS,
  matchEducationalScenario,
  type EducationalRateScenario,
} from '@/features/calculator/constants/educational-scenarios';
import { getFundByIsin } from '@/features/funds/services/get-fund-by-isin';

export type CalculatorMode = 'free' | 'fund';

export type UseCompoundInterestCalculatorResult = {
  mode: CalculatorMode;
  setMode: (mode: CalculatorMode) => void;
  rateScenario: EducationalRateScenario;
  applyRateScenario: (scenario: EducationalRateScenario) => void;
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
  fieldErrors: Readonly<Record<string, string>>;
  calculate: () => boolean;
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rateScenario, setRateScenario] = useState<EducationalRateScenario>('moderate');

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
      setRateScenario('custom');
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

  const applyRateScenario = useCallback(
    (scenario: EducationalRateScenario) => {
      if (scenario === 'custom') {
        setRateScenario('custom');
        return;
      }

      const preset = EDUCATIONAL_RATE_SCENARIOS.find((entry) => entry.id === scenario);

      if (!preset) {
        return;
      }

      setRateScenario(scenario);
      setInput((current) => ({
        ...current,
        annualRatePercent: preset.annualRatePercent,
      }));
      setHasCalculated(false);
      setFieldErrors((current) => {
        const next = { ...current };
        delete next.annualRatePercent;
        return next;
      });
    },
    [],
  );

  const updateInput = useCallback((patch: Partial<CompoundInterestInput>) => {
    setInput((current) => {
      const next = { ...current, ...patch };

      if (patch.annualRatePercent !== undefined) {
        setRateScenario(matchEducationalScenario(patch.annualRatePercent));
      }

      return next;
    });
    setHasCalculated(false);
    setFieldErrors((current) => {
      const next = { ...current };

      for (const key of Object.keys(patch)) {
        delete next[key];
      }

      return next;
    });
  }, []);

  const calculate = useCallback((): boolean => {
    const validation = validateWithSchema(compoundInterestInputSchema, input);

    if (!validation.success) {
      setFieldErrors(validation.fieldErrors);
      setHasCalculated(false);
      return false;
    }

    setFieldErrors({});
    setResult(calculateCompoundInterest(validation.data));
    setHasCalculated(true);
    void trackEvent('calculator_run', 'calculator', {
      mode,
      rateScenario,
      durationYears: validation.data.durationYears,
    });
    return true;
  }, [input, mode, rateScenario]);

  const reset = useCallback(() => {
    setInput(DEFAULT_COMPOUND_INTEREST_INPUT);
    setRateScenario('moderate');
    setResult(null);
    setHasCalculated(false);
    setFieldErrors({});
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
      try {
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
      } catch {
        if (!cancelled) {
          setFundError('No se pudo cargar la información del fondo seleccionado.');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialIsin, loadFund]);

  return {
    mode,
    setMode,
    rateScenario,
    applyRateScenario,
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
    fieldErrors,
    calculate,
    reset,
  };
}
