import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import type {
  CompoundInterestInput,
  CompoundInterestResult,
} from '@/features/calculator/models/compound-interest.engine';
import { buildCalculatorExportCsv } from '@/features/calculator/services/build-calculator-export-csv';

export type ExportCalculatorSimulationResult =
  | { status: 'downloaded' }
  | { status: 'shared' }
  | { status: 'copied' }
  | { status: 'error'; message: string };

/**
 * Builds a stable export filename for a simulation CSV.
 */
function buildExportFilename(): string {
  const stamp = new Date().toISOString().slice(0, 10);
  return `inversora-simulacion-${stamp}.csv`;
}

/**
 * Triggers a CSV download on web clients.
 *
 * @param csv - CSV document contents.
 * @param filename - Download filename.
 */
function downloadCsvOnWeb(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports a calculator simulation as CSV.
 * Web: direct download. Native: system share sheet. Fallback: clipboard copy.
 *
 * @param input - Scenario parameters.
 * @param result - Simulation output.
 */
export async function exportCalculatorSimulation(
  input: CompoundInterestInput,
  result: CompoundInterestResult,
): Promise<ExportCalculatorSimulationResult> {
  const csv = `\uFEFF${buildCalculatorExportCsv(input, result)}`;
  const filename = buildExportFilename();

  if (Platform.OS === 'web') {
    try {
      downloadCsvOnWeb(csv, filename);
      return { status: 'downloaded' };
    } catch {
      await Clipboard.setStringAsync(csv);
      return { status: 'copied' };
    }
  }

  const cacheDirectory = FileSystem.cacheDirectory;

  if (!cacheDirectory) {
    await Clipboard.setStringAsync(csv);
    return { status: 'copied' };
  }

  try {
    const fileUri = `${cacheDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        UTI: 'public.comma-separated-values-text',
        dialogTitle: 'Exportar simulación',
      });
      return { status: 'shared' };
    }

    await Clipboard.setStringAsync(csv);
    return { status: 'copied' };
  } catch {
    try {
      await Clipboard.setStringAsync(csv);
      return { status: 'copied' };
    } catch {
      return {
        status: 'error',
        message: 'No pudimos exportar la simulación. Inténtalo de nuevo.',
      };
    }
  }
}
