import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DISCLAIMER_RANKING_EDUCATIONAL } from '@/features/legal/constants/disclaimer-snippets';
import { HomeRankingRow } from '@/features/onboarding/components/home-ranking-row';
import { toHomeRankingEntries } from '@/features/onboarding/utils/build-ranking-theme-options';
import { getRankingsGrouped } from '@/features/funds/services/get-rankings';
import {
  filterBeginnerEligibleRankedFunds,
  shouldApplyBeginnerSurfaceGuards,
} from '@/features/funds/utils/beginner-eligibility';
import { useEducationalProfile } from '@/features/learn/hooks/use-educational-profile';
import { LegalNotice } from '@/shared/components/legal/legal-notice';
import { ScreenShell } from '@/shared/components/layout/screen-shell';
import { Header } from '@/shared/components/headers';
import { TextHeading, TextParagraph } from '@/shared/components/text';
import { ContentEmptyState, ReloadState, Spinner } from '@/shared/components/ui';
import { useMobileLayout } from '@/shared/hooks/use-mobile-layout';
import { routes } from '@/shared/navigation/routes';
import { Layout, Spacing } from '@/shared/theme/theme';
import type { BenchmarkRankingGroup } from '@/core/api/parse-rankings-response';

type BenchmarkRankingLoadState = 'loading' | 'ready' | 'error' | 'empty';

const BENCHMARK_RANKING_LIMIT = 100;

/**
 * Dedicated ranking detail for a single benchmark peer group (HU-14).
 */
export default function RankingBenchmarkScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { contentWidth } = useMobileLayout();
  const { profile: educationalProfile } = useEducationalProfile();
  const applyBeginnerGuards = shouldApplyBeginnerSurfaceGuards(educationalProfile);
  const params = useLocalSearchParams<{ benchmarkKey?: string | string[] }>();
  const benchmarkKey = useMemo(() => {
    const raw = params.benchmarkKey;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return value?.trim() ?? '';
  }, [params.benchmarkKey]);

  const [group, setGroup] = useState<BenchmarkRankingGroup | null>(null);
  const [loadState, setLoadState] = useState<BenchmarkRankingLoadState>('loading');
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (benchmarkKey.length === 0) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const groups = await getRankingsGrouped({
          benchmark: benchmarkKey,
          limit: BENCHMARK_RANKING_LIMIT,
        });
        const loaded = groups[0] ?? null;

        if (cancelled) {
          return;
        }

        if (!loaded || loaded.funds.length === 0) {
          setGroup(null);
          setLoadState('empty');
          return;
        }

        setGroup(loaded);
        setLoadState('ready');
      } catch {
        if (!cancelled) {
          setGroup(null);
          setLoadState('error');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [benchmarkKey, reloadToken]);

  const entries = useMemo(() => {
    if (!group) {
      return [];
    }

    const funds = applyBeginnerGuards
      ? filterBeginnerEligibleRankedFunds(group.funds)
      : group.funds;

    return toHomeRankingEntries(funds);
  }, [applyBeginnerGuards, group]);

  const displayLoadState: BenchmarkRankingLoadState =
    benchmarkKey.length === 0 ? 'empty' : loadState;

  return (
    <ScreenShell
      header={
        <Header
          title={group?.benchmark ?? 'Ranking'}
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
            <TextHeading variant="section">Ranking comparable</TextHeading>
            <TextParagraph variant="secondary" themeColor="textSecondary">
              {group
                ? `${group.total} fondo${group.total === 1 ? '' : 's'} en el grupo «${group.benchmark}». Posiciones relativas dentro del mismo benchmark.`
                : 'Cargando ranking…'}
            </TextParagraph>
          </View>

          {displayLoadState === 'loading' ? (
            <View className="items-center py-xl">
              <Spinner accessibilityLabel="Cargando ranking del benchmark" />
            </View>
          ) : null}

          {displayLoadState === 'error' ? (
            <ReloadState
              title="No se pudo cargar este ranking"
              message="Comprueba tu conexión e inténtalo de nuevo."
              onAction={() => {
                setLoadState('loading');
                setReloadToken((current) => current + 1);
              }}
            />
          ) : null}

          {displayLoadState === 'empty' ? (
            <ContentEmptyState
              title="Sin fondos en este benchmark"
              message="Prueba otro grupo desde el índice de rankings."
              actionLabel="Ver todos los rankings"
              onAction={() => {
                router.push(routes.rankings);
              }}
            />
          ) : null}

          {displayLoadState === 'ready' && entries.length === 0 ? (
            <ContentEmptyState
              title="Sin fondos elegibles en este benchmark"
              message="No hay fondos que cumplan los criterios educativos para principiantes en este grupo."
              actionLabel="Ver todos los rankings"
              onAction={() => {
                router.push(routes.rankings);
              }}
            />
          ) : null}

          {displayLoadState === 'ready' && entries.length > 0 ? (
            <View className="gap-sm">
              {entries.map((fund) => (
                <HomeRankingRow
                  key={fund.isin}
                  fund={fund}
                  onPress={() => {
                    router.push(routes.fundDetail(fund.isin));
                  }}
                />
              ))}
            </View>
          ) : null}

          <LegalNotice title="Ranking educativo" body={DISCLAIMER_RANKING_EDUCATIONAL} />
        </ScrollView>
      }
    />
  );
}
