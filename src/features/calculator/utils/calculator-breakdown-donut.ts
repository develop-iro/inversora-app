import type { CompoundInterestBreakdown } from '@/features/calculator/models/compound-interest.engine';

export type DonutSegmentKey = 'initial' | 'deposits' | 'interest';

export type DonutSegmentDefinition = {
  readonly key: DonutSegmentKey;
  readonly label: string;
  readonly value: number;
  readonly color: string;
};

export type DonutSegmentArc = DonutSegmentDefinition & {
  readonly startAngle: number;
  readonly endAngle: number;
  readonly percentage: number;
};

export type DonutSegmentColors = {
  readonly initial: string;
  readonly deposits: string;
  readonly interest: string;
};

const SEGMENT_ORDER: readonly {
  key: DonutSegmentKey;
  label: string;
  colorKey: keyof DonutSegmentColors;
}[] = [
  { key: 'initial', label: 'Balance inicial', colorKey: 'initial' },
  { key: 'deposits', label: 'Aportaciones', colorKey: 'deposits' },
  { key: 'interest', label: 'Interés acumulado', colorKey: 'interest' },
];

/**
 * Builds donut segment metadata from the final balance breakdown.
 *
 * @param breakdown - Final balance composition.
 * @param colors - Segment colors aligned with the calculator legend.
 */
export function buildDonutSegments(
  breakdown: CompoundInterestBreakdown,
  colors: DonutSegmentColors,
): DonutSegmentArc[] {
  const values: Record<DonutSegmentKey, number> = {
    initial: Math.max(breakdown.initialComponent, 0),
    deposits: Math.max(breakdown.depositsComponent, 0),
    interest: Math.max(breakdown.interestComponent, 0),
  };

  const total = values.initial + values.deposits + values.interest;

  if (total <= 0) {
    return [];
  }

  let cursor = 0;

  return SEGMENT_ORDER.flatMap((segment) => {
    const value = values[segment.key];

    if (value <= 0) {
      return [];
    }

    const percentage = value / total;
    const sweep = percentage * 360;
    const startAngle = cursor;
    const endAngle = cursor + sweep;
    cursor = endAngle;

    return [
      {
        key: segment.key,
        label: segment.label,
        value,
        color: colors[segment.colorKey],
        startAngle,
        endAngle,
        percentage,
      },
    ];
  });
}

/**
 * Converts a clockwise angle (0° = top) to cartesian coordinates.
 *
 * @param centerX - Circle center X.
 * @param centerY - Circle center Y.
 * @param radius - Circle radius.
 * @param angleDegrees - Clockwise degrees from the top.
 */
export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleDegrees: number,
): { readonly x: number; readonly y: number } {
  const radians = ((angleDegrees - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(radians),
    y: centerY + radius * Math.sin(radians),
  };
}

/**
 * Builds an annular sector path for SVG rendering.
 *
 * @param centerX - Donut center X.
 * @param centerY - Donut center Y.
 * @param outerRadius - Outer radius.
 * @param innerRadius - Inner radius (hole).
 * @param startAngle - Clockwise start angle from the top.
 * @param endAngle - Clockwise end angle from the top.
 */
export function buildAnnularSectorPath(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const sweep = endAngle - startAngle;

  if (sweep >= 359.999) {
    return buildFullDonutPath(centerX, centerY, outerRadius, innerRadius);
  }

  const largeArcFlag = sweep > 180 ? 1 : 0;
  const outerStart = polarToCartesian(centerX, centerY, outerRadius, startAngle);
  const outerEnd = polarToCartesian(centerX, centerY, outerRadius, endAngle);
  const innerEnd = polarToCartesian(centerX, centerY, innerRadius, endAngle);
  const innerStart = polarToCartesian(centerX, centerY, innerRadius, startAngle);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

function buildFullDonutPath(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
): string {
  const outerLeft = polarToCartesian(centerX, centerY, outerRadius, 0);
  const outerRight = polarToCartesian(centerX, centerY, outerRadius, 180);
  const innerRight = polarToCartesian(centerX, centerY, innerRadius, 180);
  const innerLeft = polarToCartesian(centerX, centerY, innerRadius, 0);

  return [
    `M ${outerLeft.x} ${outerLeft.y}`,
    `A ${outerRadius} ${outerRadius} 0 1 1 ${outerRight.x} ${outerRight.y}`,
    `A ${outerRadius} ${outerRadius} 0 1 1 ${outerLeft.x} ${outerLeft.y}`,
    `M ${innerLeft.x} ${innerLeft.y}`,
    `A ${innerRadius} ${innerRadius} 0 1 0 ${innerRight.x} ${innerRight.y}`,
    `A ${innerRadius} ${innerRadius} 0 1 0 ${innerLeft.x} ${innerLeft.y}`,
    'Z',
  ].join(' ');
}

/**
 * Resolves the segment under a tap within the donut bounds.
 *
 * @param locationX - Tap X relative to the chart square.
 * @param locationY - Tap Y relative to the chart square.
 * @param chartSize - Chart width and height.
 * @param innerRadius - Donut inner radius.
 * @param outerRadius - Donut outer radius.
 * @param segments - Donut segments ordered clockwise from the top.
 */
export function resolveDonutSegmentAtPoint(
  locationX: number,
  locationY: number,
  chartSize: number,
  innerRadius: number,
  outerRadius: number,
  segments: readonly DonutSegmentArc[],
): DonutSegmentKey | null {
  const center = chartSize / 2;
  const dx = locationX - center;
  const dy = locationY - center;
  const distance = Math.hypot(dx, dy);

  if (distance < innerRadius || distance > outerRadius) {
    return null;
  }

  const angleRadians = Math.atan2(dy, dx);
  let angleDegrees = (angleRadians * 180) / Math.PI + 90;

  if (angleDegrees < 0) {
    angleDegrees += 360;
  }

  const match = segments.find((segment) => {
    const isLast = segment.endAngle >= 359.999;
    return (
      angleDegrees >= segment.startAngle &&
      (angleDegrees < segment.endAngle || (isLast && angleDegrees <= segment.endAngle))
    );
  });

  return match?.key ?? null;
}
