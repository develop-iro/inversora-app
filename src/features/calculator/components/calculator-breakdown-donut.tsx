import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import {
  formatCalculatorCurrency,
  type CompoundInterestResult,
} from '@/features/calculator/models/compound-interest.engine';
import {
  buildAnnularSectorPath,
  buildDonutSegments,
  resolveDonutSegmentAtPoint,
  type DonutSegmentKey,
} from '@/features/calculator/utils/calculator-breakdown-donut';
import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export type CalculatorBreakdownDonutProps = {
  result: CompoundInterestResult;
};

const CHART_SIZE = 220;
const OUTER_RADIUS = 100;
const INNER_RADIUS = 62;
const CENTER_DISC_SIZE = INNER_RADIUS * 2 - 12;
const CENTER_DISC_OFFSET = (CHART_SIZE - CENTER_DISC_SIZE) / 2;

/**
 * Interactive donut chart for the final balance composition.
 */
export function CalculatorBreakdownDonut({ result }: CalculatorBreakdownDonutProps) {
  const theme = useTheme();
  const [selectedKey, setSelectedKey] = useState<DonutSegmentKey | null>(null);

  const segments = useMemo(
    () =>
      buildDonutSegments(result.breakdown, {
        initial: theme.deepOcean,
        deposits: theme.primary,
        interest: theme.chartInterest,
      }),
    [result.breakdown, theme.chartInterest, theme.deepOcean, theme.primary],
  );

  const selectedSegment =
    selectedKey != null ? segments.find((segment) => segment.key === selectedKey) : null;

  const centerLabel = selectedSegment?.label ?? 'Balance final';
  const centerValue = selectedSegment?.value ?? result.finalBalance;
  const centerDetail = selectedSegment
    ? `${Math.round(selectedSegment.percentage * 1000) / 10}% del total`
    : null;

  const accessibilityLabel = selectedSegment
    ? `${selectedSegment.label}: ${formatCalculatorCurrency(selectedSegment.value)}`
    : `Balance final ${formatCalculatorCurrency(result.finalBalance)}`;

  const handleSegmentPress = useCallback((key: DonutSegmentKey) => {
    setSelectedKey((current) => (current === key ? null : key));
  }, []);

  const handleChartPress = useCallback(
    (locationX: number, locationY: number) => {
      const key = resolveDonutSegmentAtPoint(
        locationX,
        locationY,
        CHART_SIZE,
        INNER_RADIUS,
        OUTER_RADIUS,
        segments,
      );

      if (key) {
        handleSegmentPress(key);
      }
    },
    [handleSegmentPress, segments],
  );

  if (segments.length === 0) {
    return null;
  }

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Toca un segmento del gráfico o una fila de la leyenda para ver cada componente"
      className="gap-md rounded-card bg-background-soft px-md py-md"
    >
      <TextParagraph variant="emphasis">Composición del balance final</TextParagraph>

      <View className="items-center">
        <Pressable
          accessibilityRole="image"
          accessibilityLabel={accessibilityLabel}
          onPress={(event) =>
            handleChartPress(event.nativeEvent.locationX, event.nativeEvent.locationY)
          }
          // tailwind-exception: fixed chart canvas for SVG geometry
          style={{ width: CHART_SIZE, height: CHART_SIZE }}
        >
          <Svg width={CHART_SIZE} height={CHART_SIZE}>
            {segments.map((segment) => {
              const isSelected = selectedKey === null || selectedKey === segment.key;

              return (
                <Path
                  key={segment.key}
                  d={buildAnnularSectorPath(
                    CHART_SIZE / 2,
                    CHART_SIZE / 2,
                    OUTER_RADIUS,
                    INNER_RADIUS,
                    segment.startAngle,
                    segment.endAngle,
                  )}
                  fill={segment.color}
                  opacity={isSelected ? 1 : 0.35}
                  onPress={() => handleSegmentPress(segment.key)}
                />
              );
            })}
          </Svg>

          <View
            pointerEvents="none"
            className="absolute items-center justify-center rounded-full bg-surface px-xs"
            // tailwind-exception: center disc matches the donut hole geometry
            style={{
              width: CENTER_DISC_SIZE,
              height: CENTER_DISC_SIZE,
              left: CENTER_DISC_OFFSET,
              top: CENTER_DISC_OFFSET,
            }}
          >
            <TextParagraph
              variant="secondary"
              themeColor="textSecondary"
              className="text-center leading-tight"
              numberOfLines={2}
            >
              {centerLabel}
            </TextParagraph>
            <TextParagraph
              variant="emphasis"
              themeColor="deepOcean"
              className="text-center leading-tight"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {formatCalculatorCurrency(centerValue)}
            </TextParagraph>
            {centerDetail ? (
              <TextParagraph
                variant="secondary"
                themeColor="textSecondary"
                className="text-center leading-tight"
                numberOfLines={1}
              >
                {centerDetail}
              </TextParagraph>
            ) : null}
          </View>
        </Pressable>
        {selectedKey === null ? (
          <TextParagraph
            variant="secondary"
            themeColor="textSecondary"
            className="mt-xs text-center"
          >
            Toca un segmento para ver el detalle
          </TextParagraph>
        ) : null}
      </View>

      <View className="gap-sm">
        {segments.map((segment) => {
          const isSelected = selectedKey === segment.key;

          return (
            <Pressable
              key={segment.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${segment.label}: ${formatCalculatorCurrency(segment.value)}`}
              onPress={() => handleSegmentPress(segment.key)}
              className={cn(
                'flex-row items-center gap-sm rounded-card px-sm py-xs',
                isSelected ? 'bg-surface' : 'bg-transparent',
              )}
            >
              <View
                className="h-3 w-3 rounded-xs"
                // tailwind-exception: segment swatch uses theme hex from chart data
                style={{ backgroundColor: segment.color }}
              />
              <TextParagraph variant="secondary" className="flex-1">
                {segment.label}
              </TextParagraph>
              <TextParagraph variant="emphasis">
                {formatCalculatorCurrency(segment.value)}
              </TextParagraph>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
