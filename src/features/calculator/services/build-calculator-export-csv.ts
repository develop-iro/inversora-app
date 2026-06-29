import type {
  CompoundInterestInput,
  CompoundInterestResult,
} from '@/features/calculator/models/compound-interest.engine';

const CSV_SEPARATOR = ';';

/**
 * Formats a numeric amount for CSV export in Spanish Excel style.
 *
 * @param value - Amount in EUR.
 */
function formatCsvAmount(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

/**
 * Escapes a CSV cell when it contains separators or line breaks.
 *
 * @param value - Raw cell text.
 */
function escapeCsvCell(value: string): string {
  if (value.includes(CSV_SEPARATOR) || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

function joinCsvRow(cells: readonly string[]): string {
  return cells.map(escapeCsvCell).join(CSV_SEPARATOR);
}

function buildFrequencyLabel(frequency: CompoundInterestInput['depositFrequency']): string {
  return frequency === 'monthly' ? 'Mensual' : 'Anual';
}

function buildTimingLabel(timing: CompoundInterestInput['depositTiming']): string {
  return timing === 'start' ? 'Al inicio del periodo' : 'Al final del periodo';
}

/**
 * Builds a UTF-8 CSV document for a compound interest simulation.
 * Uses semicolon separators for compatibility with Excel in Spanish locales.
 *
 * @param input - Scenario parameters.
 * @param result - Simulation output.
 */
export function buildCalculatorExportCsv(
  input: CompoundInterestInput,
  result: CompoundInterestResult,
): string {
  const lines: string[] = [
    joinCsvRow(['Simulación educativa Inversora']),
    joinCsvRow(['Generada', new Date().toISOString()]),
    joinCsvRow([
      'Aviso',
      'Simulación educativa sin valor predictivo. No constituye asesoramiento financiero.',
    ]),
    '',
    joinCsvRow(['Parámetros']),
    joinCsvRow(['Balance inicial (€)', formatCsvAmount(input.initialBalance)]),
    joinCsvRow(['Aportación periódica (€)', formatCsvAmount(input.periodicDeposit)]),
    joinCsvRow(['Frecuencia de aportación', buildFrequencyLabel(input.depositFrequency)]),
    joinCsvRow(['Momento del aporte', buildTimingLabel(input.depositTiming)]),
    joinCsvRow(['Tipo de interés anual (%)', formatCsvAmount(input.annualRatePercent)]),
    joinCsvRow(['Duración (años)', String(input.durationYears)]),
    '',
    joinCsvRow(['Resumen']),
    joinCsvRow(['Balance final (€)', formatCsvAmount(result.finalBalance)]),
    joinCsvRow(['Aportaciones totales (€)', formatCsvAmount(result.breakdown.depositsComponent)]),
    joinCsvRow(['Interés acumulado (€)', formatCsvAmount(result.breakdown.interestComponent)]),
    '',
    joinCsvRow([
      'Año',
      'Aportación año (€)',
      'Aportación total (€)',
      'Interés año (€)',
      'Interés acumulado (€)',
      'Balance (€)',
    ]),
  ];

  for (const row of result.rows) {
    lines.push(
      joinCsvRow([
        String(row.year),
        formatCsvAmount(row.periodicDepositsThisYear),
        formatCsvAmount(row.cumulativeDeposits),
        formatCsvAmount(row.interestThisYear),
        formatCsvAmount(row.cumulativeInterest),
        formatCsvAmount(row.balance),
      ]),
    );
  }

  return lines.join('\n');
}
