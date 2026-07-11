import { MIN_COMPARE_FUNDS } from '@/core/storage/compare-selection-storage-key';
import { CompareFundVersusHeader } from '@/features/comparison/components/compare-fund-versus-header';
import { ComparePartialSelectionHint } from '@/features/comparison/components/compare-partial-selection-hint';
import type { CompareFundEntry } from '@/features/comparison/models/compare-fund-entry';
import { SectionCard } from '@/shared/components/layout';
import { TextParagraph } from '@/shared/components/text';
import { Button } from '@/shared/components/ui/button';
import { Divider } from '@/shared/components/ui/divider';
import { Spacing } from '@/shared/theme/theme';

export type CompareSelectionPanelProps = {
  entries: readonly CompareFundEntry[];
  selectedCount: number;
  needsSecondFund: boolean;
  canAddMore: boolean;
  onRemoveFund: (isin: string) => void;
  onOpenPicker: () => void;
  onApplyPair: (isins: readonly string[]) => void;
};

function resolveSelectionSummary(
  selectedCount: number,
  needsSecondFund: boolean,
  canAddMore: boolean,
): string {
  if (needsSecondFund) {
    return 'Elige un segundo fondo para activar la tabla comparativa y SORA.';
  }

  if (canAddMore) {
    return `${selectedCount} fondos en la comparación. Puedes añadir uno más.`;
  }

  return `${selectedCount} fondos en la comparación.`;
}

/**
 * Unified panel for fund selection, add actions, and partial-selection helpers.
 */
export function CompareSelectionPanel({
  entries,
  selectedCount,
  needsSecondFund,
  canAddMore,
  onRemoveFund,
  onOpenPicker,
  onApplyPair,
}: CompareSelectionPanelProps) {
  const summary = resolveSelectionSummary(selectedCount, needsSecondFund, canAddMore);

  return (
    <SectionCard title="Fondos seleccionados" summary={summary}>
      <CompareFundVersusHeader
        entries={entries}
        onRemoveFund={onRemoveFund}
        onAddFund={needsSecondFund && canAddMore ? onOpenPicker : undefined}
      />

      {canAddMore && !needsSecondFund ? (
        <Button
          label="+ Añadir fondo"
          variant="ghost"
          size="sm"
          onPress={onOpenPicker}
          accessibilityLabel="Añadir fondo"
        />
      ) : null}

      {!canAddMore && selectedCount >= MIN_COMPARE_FUNDS ? (
        <TextParagraph variant="secondary" themeColor="textSecondary" className="text-center">
          Máximo de fondos alcanzado.
        </TextParagraph>
      ) : null}

      {needsSecondFund ? (
        <>
          <Divider spacing={Spacing.sm} />
          <ComparePartialSelectionHint
            onOpenPicker={onOpenPicker}
            onApplyPair={onApplyPair}
          />
        </>
      ) : null}
    </SectionCard>
  );
}
