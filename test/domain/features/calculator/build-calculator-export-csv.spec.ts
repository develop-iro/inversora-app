import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { calculateCompoundInterest } from '@/features/calculator/models/compound-interest.engine';
import { buildCalculatorExportCsv } from '@/features/calculator/services/build-calculator-export-csv';

describe('buildCalculatorExportCsv', () => {
  it('builds a semicolon CSV with Spanish decimal separators and the legal notice', () => {
    const input = {
      initialBalance: 1000,
      periodicDeposit: 100,
      depositFrequency: 'monthly' as const,
      depositTiming: 'end' as const,
      annualRatePercent: 5,
      durationYears: 2,
    };
    const result = calculateCompoundInterest(input);
    const csv = buildCalculatorExportCsv(input, result);

    assert.match(csv, /Simulación educativa Inversora/);
    assert.match(
      csv,
      /Simulación educativa sin valor predictivo\. No constituye asesoramiento financiero\./,
    );
    assert.match(csv, /Balance inicial \(€\);1000,00/);
    assert.match(csv, /Frecuencia de aportación;Mensual/);
    assert.match(csv, /Año;Aportación año/);
    assert.ok(csv.includes('\n'));
    assert.ok(csv.split('\n').some((line) => line.includes(';')));
  });

  it('escapes cells that contain the CSV separator', () => {
    const input = {
      initialBalance: 0,
      periodicDeposit: 0,
      depositFrequency: 'yearly' as const,
      depositTiming: 'end' as const,
      annualRatePercent: 3,
      durationYears: 1,
    };
    const result = calculateCompoundInterest(input);
    const csv = buildCalculatorExportCsv(input, result);

    assert.match(csv, /Frecuencia de aportación;Anual/);
    assert.match(csv, /Tipo de interés anual \(%\);3,00/);
  });
});
