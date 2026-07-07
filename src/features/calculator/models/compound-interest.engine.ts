/** How often periodic contributions are added. */
export type DepositFrequency = 'monthly' | 'yearly';

/** Whether deposits happen at the start or end of each period. */
export type DepositTiming = 'start' | 'end';

/** User-editable compound interest scenario. */
export type CompoundInterestInput = {
  readonly initialBalance: number;
  readonly periodicDeposit: number;
  readonly depositFrequency: DepositFrequency;
  readonly depositTiming: DepositTiming;
  readonly annualRatePercent: number;
  readonly durationYears: number;
};

/** Final balance split into educational components (nominal deposits + interest). */
export type CompoundInterestBreakdown = {
  readonly initialComponent: number;
  readonly depositsComponent: number;
  readonly interestComponent: number;
};

/** Year-by-year projection row. */
export type CompoundInterestYearRow = {
  readonly year: number;
  readonly periodicDepositsThisYear: number;
  readonly cumulativeDeposits: number;
  readonly interestThisYear: number;
  readonly cumulativeInterest: number;
  readonly balance: number;
};

/** Full compound interest simulation output. */
export type CompoundInterestResult = {
  readonly finalBalance: number;
  readonly breakdown: CompoundInterestBreakdown;
  readonly rows: readonly CompoundInterestYearRow[];
};

const MAX_DURATION_YEARS = 40;

function getPeriodsPerYear(frequency: DepositFrequency): number {
  return frequency === 'monthly' ? 12 : 1;
}

/**
 * Runs a deterministic compound interest simulation with periodic contributions.
 *
 * @param input - Scenario parameters.
 */
export function calculateCompoundInterest(
  input: CompoundInterestInput,
): CompoundInterestResult {
  const durationYears = Math.min(Math.max(Math.round(input.durationYears), 1), MAX_DURATION_YEARS);
  const periodsPerYear = getPeriodsPerYear(input.depositFrequency);
  const totalPeriods = durationYears * periodsPerYear;
  const periodRate = input.annualRatePercent / 100 / periodsPerYear;

  let balance = Math.max(input.initialBalance, 0);
  let cumulativeDeposits = 0;
  let cumulativeInterest = 0;

  const rows: CompoundInterestYearRow[] = [];
  let previousYearDeposits = 0;
  let previousYearInterest = 0;

  for (let period = 1; period <= totalPeriods; period += 1) {
    const deposit = Math.max(input.periodicDeposit, 0);

    if (input.depositTiming === 'start' && deposit > 0) {
      balance += deposit;
      cumulativeDeposits += deposit;
    }

    const interestAccrued = balance * periodRate;
    balance += interestAccrued;
    cumulativeInterest += interestAccrued;

    if (input.depositTiming === 'end' && deposit > 0) {
      balance += deposit;
      cumulativeDeposits += deposit;
    }

    const completedYear = Math.ceil(period / periodsPerYear);
    const isYearEnd = period % periodsPerYear === 0 || period === totalPeriods;

    if (isYearEnd) {
      rows.push({
        year: completedYear,
        periodicDepositsThisYear: cumulativeDeposits - previousYearDeposits,
        cumulativeDeposits,
        interestThisYear: cumulativeInterest - previousYearInterest,
        cumulativeInterest,
        balance: Number(balance.toFixed(2)),
      });
      previousYearDeposits = cumulativeDeposits;
      previousYearInterest = cumulativeInterest;
    }
  }

  const initialComponent = Math.max(input.initialBalance, 0);
  const depositsComponent = cumulativeDeposits;
  const interestComponent = Math.max(
    0,
    Number((balance - initialComponent - depositsComponent).toFixed(2)),
  );

  return {
    finalBalance: Number(balance.toFixed(2)),
    breakdown: {
      initialComponent,
      depositsComponent,
      interestComponent,
    },
    rows,
  };
}

/** Default educational scenario for first render. */
export const DEFAULT_COMPOUND_INTEREST_INPUT: CompoundInterestInput = {
  initialBalance: 1000,
  periodicDeposit: 100,
  depositFrequency: 'monthly',
  depositTiming: 'start',
  annualRatePercent: 5,
  durationYears: 10,
};

export {
  formatLocalizedDecimal as formatCalculatorInputNumber,
  parseLocalizedNumber as parseCalculatorNumber,
} from '@/shared/components/inputs/input-utils';

/**
 * Formats currency for calculator results.
 *
 * @param value - Numeric amount in EUR.
 */
export function formatCalculatorCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
