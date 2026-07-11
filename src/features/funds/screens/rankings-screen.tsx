import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DISCLAIMER_RANKING_EDUCATIONAL } from '@/features/legal/constants/disclaimer-snippets';
import { getRankingsGrouped, RANKINGS_GROUP_INDEX_LIMIT } from '@/features/funds/services/get-rankings';
import {
  filterBeginnerEligibleRankingGroups,
  shouldApplyBeginnerSurfaceGuards,
} from '@/features/funds/utils/beginner-eligibility';
import { useEducationalProfile } from '@/features/learn/hooks/use-educational-profile';
import { resolveRankingThemeIcon } from '@/features/onboarding/utils/build-ranking-theme-options';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { ScreenShell } from '@/shared/components/layout/screen-shell';
import { Header } from '@/shared/components/headers';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';
import { ContentEmptyState, ReloadState, Spinner } from '@/shared/components/ui';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { useTheme } from '@/shared/hooks/use-theme';
import { routes } from '@/shared/navigation/routes';
import { Layout, Spacing } from '@/shared/theme/theme';
import type { BenchmarkRankingGroup } from '@/core/api/parse-rankings-response';

type RankingsLoadState = 'loading' | 'ready' | 'error' | 'empty';

/**
 * Benchmark-group index for HU-14 dedicated ranking surface.
 */
export default function RankingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { contentWidth } = useMobileLayout();
  const { profile: educationalProfile } = useEducationalProfile();
  const applyBeginnerGuards = shouldApplyBeginnerSurfaceGuards(educationalProfile);
  const [groups, setGroups] = useState<BenchmarkRankingGroup[]>([]);
  const [loadState, setLoadState] = useState<RankingsLoadState>('loading');
  const visibleGroups = useMemo(
    () => (applyBeginnerGuards ? filterBeginnerEligibleRankingGroups(groups) : groups),
    [applyBeginnerGuards, groups],
  );

  const loadGroups = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setLoadState('loading');
    }

    try {
      const loaded = await getRankingsGrouped({ limit: RANKINGS_GROUP_INDEX_LIMIT });

      if (loaded.length === 0) {
        setGroups([]);
        setLoadState('empty');
        return;
      }

      setGroups(loaded);
      setLoadState('ready');
    } catch {
      setGroups([]);
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const loaded = await getRankingsGrouped({ limit: RANKINGS_GROUP_INDEX_LIMIT });

        if (cancelled) {
          return;
        }

        if (loaded.length === 0) {
          setGroups([]);
          setLoadState('empty');
          return;
        }

        setGroups(loaded);
        setLoadState('ready');
      } catch {
        if (!cancelled) {
          setGroups([]);
          setLoadState('error');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ScreenShell
      header={
        <Header
          title="Rankings por benchmark"
          leadingActions={['back']}
          onAction={{
            back: () => router.back(),
          }}
        />
      }
      body={
        <ScrollView
          className="min-h-0 w-full flex-1 bg-background"
          contentContainerClassName="gap-lg self-center pt-lg"
          contentContainerStyle={{
            width: contentWidth,
            maxWidth: contentWidth,
            paddingHorizontal: Layout.screenPaddingHorizontal,
            paddingBottom: insets.bottom + Spacing['3xl'],
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-sm">
            <TextHeading variant="section">Comparables por índice</TextHeading>
            <TextParagraph variant="secondary" themeColor="textSecondary">
              Cada ranking agrupa fondos con el mismo benchmark para comparar criterios
              homogéneos según el Score Inversora.
            </TextParagraph>
          </View>

          {loadState === 'loading' ? (
            <View className="items-center py-xl">
              <Spinner accessibilityLabel="Cargando rankings" />
            </View>
          ) : null}

          {loadState === 'error' ? (
            <ReloadState
              title="No se pudieron cargar los rankings"
              message="Comprueba tu conexión e inténtalo de nuevo."
              onAction={() => {
                void loadGroups(true);
              }}
            />
          ) : null}

          {loadState === 'empty' || (loadState === 'ready' && visibleGroups.length === 0) ? (
            <ContentEmptyState
              title="Sin rankings disponibles"
              message="Aún no hay fondos elegibles para mostrar rankings comparables."
            />
          ) : null}

          {loadState === 'ready' && visibleGroups.length > 0 ? (
            <View className="gap-sm">
              {visibleGroups.map((group) => (
                <Pressable
                  key={group.benchmarkKey}
                  accessibilityRole="button"
                  accessibilityLabel={`Ver ranking de ${group.benchmark}, ${group.total} fondos comparables`}
                  onPress={() => {
                    router.push(routes.rankingBenchmark(group.benchmarkKey));
                  }}
                  className="rounded-field border border-border bg-surface px-md py-md active:opacity-[0.92]"
                >
                  <View className="flex-row items-center gap-md">
                    <View className="min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-background-soft">
                      <MaterialCommunityIcons
                        name={resolveRankingThemeIcon(group.benchmark)}
                        size={22}
                        color={theme.primary}
                      />
                    </View>
                    <View className="flex-1 gap-half">
                      <TextParagraph variant="emphasis">{group.benchmark}</TextParagraph>
                      <TextParagraph variant="secondary" themeColor="textSecondary">
                        {group.total} fondo{group.total === 1 ? '' : 's'} comparables
                      </TextParagraph>
                    </View>
                    <View className="items-end gap-half">
                      <TextLabel variant="meta" themeColor="textSecondary">
                        Mejor score
                      </TextLabel>
                      <TextLabel variant="chip" themeColor="primary">
                        {Math.max(...group.funds.map((fund) => fund.score), 0)}/100
                      </TextLabel>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color={theme.textSecondary}
                    />
                  </View>
                </Pressable>
              ))}
            </View>
          ) : null}

          <LegalNotice title="Ranking educativo" body={DISCLAIMER_RANKING_EDUCATIONAL} />
        </ScrollView>
      }
    />
  );
}
