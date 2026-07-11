import { useMemo } from 'react';
import { View } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { ChartMetrics } from '@/shared/theme/chart-metrics';
import { typographyClassNames } from '@/shared/nativewind/theme-classes';
import { Size } from '@/shared/theme/theme';
import { cn } from '@/shared/utils/cn';

export type HorizontalBarDatum = {
  id: string;
  label: string;
  value: number | null;
};

export type HorizontalBarChartProps = {
  data: HorizontalBarDatum[];
  accessibilityLabel: string;
  maxValue?: number;
  className?: string;
};

const Y_AXIS_STEPS = [0, 5, 10, 15, 20, 25, 30];

function formatBarValue(value: number): string {
  return `${value.toFixed(2).replace('.', ',')}%`;
}

export function HorizontalBarChart({
  data,
  accessibilityLabel,
  maxValue = 30,
  className,
}: HorizontalBarChartProps) {
  const theme = useTheme(); // tailwind-exception: grid lines and bar fill colors

  const scaleMax = useMemo(() => {
    const values = data
      .map((d) => d.value)
      .filter((v): v is number => v != null);
    if (values.length === 0) {
      return maxValue;
    }
    const peak = Math.max(...values, 0);
    return Math.max(maxValue, Math.ceil(peak / 5) * 5);
  }, [data, maxValue]);

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      className={cn('self-stretch', className)}
      // tailwind-exception: chart min height from ChartMetrics
      style={{ minHeight: ChartMetrics.height }}
    >
      <View className="flex-row gap-sm">
        <View
          className="justify-between"
          // tailwind-exception: y-axis dimensions from chart metrics
          style={{
            width: ChartMetrics.yAxisWidth,
            height:
              ChartMetrics.barMaxHeight +
              ChartMetrics.yAxisPaddingTop +
              ChartMetrics.yAxisPaddingBottom,
            paddingTop: ChartMetrics.yAxisPaddingTop,
            paddingBottom: ChartMetrics.yAxisPaddingBottom,
          }}
        >
          {[...Y_AXIS_STEPS].reverse().map((step) =>
            step <= scaleMax ? (
              <TextParagraph
                key={step}
                variant="secondary"
                themeColor="textSecondary"
                className={typographyClassNames.chartAxis}
              >
                {step}
              </TextParagraph>
            ) : null,
          )}
        </View>
        <View className="relative min-w-0 flex-1">
          {Y_AXIS_STEPS.filter((s) => s <= scaleMax && s > 0).map((step) => (
            <View
              key={step}
              pointerEvents="none"
              className="absolute left-0 right-0 h-px"
              // tailwind-exception: grid line position and color
              style={{
                bottom: (step / scaleMax) * ChartMetrics.barMaxHeight,
                backgroundColor: theme.border,
              }}
            />
          ))}
          <View
            className="flex-row items-end justify-between gap-xs"
            // tailwind-exception: bar row height from chart metrics
            style={{
              paddingTop: ChartMetrics.yAxisPaddingTop,
              minHeight: ChartMetrics.barMaxHeight + ChartMetrics.labelAreaHeight,
            }}
          >
            {data.map((datum) => {
              const hasValue = datum.value != null;
              const height = hasValue
                ? Math.max(
                    ChartMetrics.barMinHeight,
                    (datum.value! / scaleMax) * ChartMetrics.barMaxHeight,
                  )
                : 0;

              return (
                <View key={datum.id} className="min-w-0 flex-1 items-center gap-xs">
                  {hasValue ? (
                    <TextParagraph variant="secondary" className={cn(typographyClassNames.chartLabel, 'text-center')}>
                      {formatBarValue(datum.value!)}
                    </TextParagraph>
                  ) : (
                    <View style={{ height: Size.chartBarValue }} />
                  )}
                  <View
                    className="w-[72%] items-center justify-end"
                    // tailwind-exception: bar track dimensions
                    style={{
                      height: ChartMetrics.barMaxHeight,
                      maxWidth: ChartMetrics.barTrackMaxWidth,
                    }}
                  >
                    {hasValue ? (
                      <View
                        className="w-full min-w-[8px] rounded-t-image"
                        // tailwind-exception: dynamic bar height and fill color
                        style={{
                          height,
                          backgroundColor: theme.primary,
                        }}
                      />
                    ) : null}
                  </View>
                  <TextParagraph
                    variant="secondary"
                    themeColor="textSecondary"
                    className={cn(typographyClassNames.chartAxis, 'text-center leading-[13px]')}
                    numberOfLines={2}
                  >
                    {datum.label}
                  </TextParagraph>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
