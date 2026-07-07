import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { HeaderActionsRow } from '@/shared/components/headers/header-actions-row';
import { HeaderBar } from '@/shared/components/headers/header-bar';
import { HeaderBrand } from '@/shared/components/headers/header-brand';
import type {
  HeaderActionHandlers,
  HeaderActionPresentation,
  HeaderActionSpec,
} from '@/shared/components/headers/header-types';
import { useHeaderActionHandlers } from '@/shared/components/headers/use-header-action-handlers';
import { TextHeading } from '@/shared/components/text/text-heading';
import { TextParagraph } from '@/shared/components/text/text-paragraph';
import { SkeletonBone } from '@/shared/components/ui/skeleton-bone';
import { SkeletonShimmerProvider } from '@/shared/components/ui/skeleton-shimmer-provider';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';
import type { WithLoading } from '@/shared/types/component-loading';

export type HeaderTitleVariant = 'nav' | 'section';

type HeaderContentProps = {
  /** When true, shows the Inversora brand instead of a centered title. */
  showBrand?: boolean;
  /** Center title for stack-style screens. Ignored when `showBrand` is true. */
  title?: string;
  subtitle?: string;
  titleVariant?: HeaderTitleVariant;
  /** Leading toolbar actions (defaults to `['back']` when `showBrand` is false). */
  leadingActions?: readonly HeaderActionSpec[];
  /** Trailing toolbar actions (defaults to `['learn']` when `showBrand` is true). */
  trailingActions?: readonly HeaderActionSpec[];
  /** Icon-only (`compact`) or icon with label (`caption`, default). */
  actionPresentation?: HeaderActionPresentation;
  onAction?: HeaderActionHandlers;
  safeAreaTop?: boolean;
  style?: StyleProp<ViewStyle>;
};

export type HeaderProps = WithLoading<
  HeaderContentProps,
  Pick<
    HeaderContentProps,
    | 'showBrand'
    | 'titleVariant'
    | 'safeAreaTop'
    | 'style'
    | 'leadingActions'
    | 'trailingActions'
    | 'actionPresentation'
    | 'onAction'
  >
>;

type ResolvedHeaderActions = {
  leadingActions: readonly HeaderActionSpec[];
  trailingActions: readonly HeaderActionSpec[];
};

/**
 * Resolves default action slots for brand vs titled headers.
 */
function resolveHeaderActions(
  showBrand: boolean,
  leadingActions: readonly HeaderActionSpec[] | undefined,
  trailingActions: readonly HeaderActionSpec[] | undefined,
): ResolvedHeaderActions {
  if (showBrand) {
    return {
      leadingActions: leadingActions ?? [],
      trailingActions: trailingActions ?? ['learn'],
    };
  }

  return {
    leadingActions: leadingActions ?? ['back'],
    trailingActions: trailingActions ?? [],
  };
}

function HeaderLoading({
  showBrand = false,
  titleVariant = 'nav',
  safeAreaTop = true,
  style,
  leadingActions,
  trailingActions,
  actionPresentation = 'caption',
  onAction,
}: Pick<
  HeaderContentProps,
  | 'showBrand'
  | 'titleVariant'
  | 'safeAreaTop'
  | 'style'
  | 'leadingActions'
  | 'trailingActions'
  | 'actionPresentation'
  | 'onAction'
>) {
  const theme = useTheme();
  const handlers = useHeaderActionHandlers(onAction);
  const resolvedActions = resolveHeaderActions(showBrand, leadingActions, trailingActions);
  const titleHeight = titleVariant === 'nav' ? 22 : 20;

  if (showBrand) {
    return (
      <HeaderBar
        layout="app"
        safeAreaTop={safeAreaTop}
        style={style}
        leading={
          <SkeletonShimmerProvider>
            <View style={styles.brandSkeleton} accessibilityLabel="Cargando encabezado">
              <SkeletonBone width={120} height={24} borderRadius={Radius.xs} />
            </View>
          </SkeletonShimmerProvider>
        }
        trailing={
          <HeaderActionsRow
            actions={resolvedActions.trailingActions}
            handlers={handlers}
            presentation={actionPresentation}
          />
        }
      />
    );
  }

  return (
    <HeaderBar
      layout="screen"
      safeAreaTop={safeAreaTop}
      style={[{ backgroundColor: theme.surface }, style]}
      leading={
        <HeaderActionsRow
          actions={resolvedActions.leadingActions}
          handlers={handlers}
          presentation={actionPresentation}
        />
      }
      center={
        <SkeletonShimmerProvider>
          <View style={styles.centerCopy} accessibilityLabel="Cargando encabezado">
            <SkeletonBone width="58%" height={titleHeight} borderRadius={Radius.xs} />
            <SkeletonBone width="42%" height={14} />
          </View>
        </SkeletonShimmerProvider>
      }
      trailing={
        <HeaderActionsRow
          actions={resolvedActions.trailingActions}
          handlers={handlers}
          presentation={actionPresentation}
        />
      }
    />
  );
}

/**
 * Configurable app header: optional brand, title, and declarative toolbar actions.
 */
export function Header(props: HeaderProps) {
  if (props.loading) {
    return (
      <HeaderLoading
        showBrand={props.showBrand}
        titleVariant={props.titleVariant}
        safeAreaTop={props.safeAreaTop}
        style={props.style}
        leadingActions={props.leadingActions}
        trailingActions={props.trailingActions}
        actionPresentation={props.actionPresentation}
        onAction={props.onAction}
      />
    );
  }

  return <HeaderContent {...props} />;
}

function HeaderContent({
  showBrand = false,
  title,
  subtitle,
  titleVariant = 'nav',
  leadingActions,
  trailingActions,
  actionPresentation = 'caption',
  onAction,
  safeAreaTop = true,
  style,
}: HeaderContentProps) {
  const theme = useTheme();
  const handlers = useHeaderActionHandlers(onAction);
  const resolvedActions = resolveHeaderActions(showBrand, leadingActions, trailingActions);

  if (showBrand) {
    return (
      <HeaderBar
        layout="app"
        safeAreaTop={safeAreaTop}
        style={style}
        leading={<HeaderBrand />}
        trailing={
          <HeaderActionsRow
            actions={resolvedActions.trailingActions}
            handlers={handlers}
            presentation={actionPresentation}
          />
        }
      />
    );
  }

  return (
    <HeaderBar
      layout="screen"
      safeAreaTop={safeAreaTop}
      style={[{ backgroundColor: theme.surface }, style]}
      leading={
        <HeaderActionsRow
          actions={resolvedActions.leadingActions}
          handlers={handlers}
          presentation={actionPresentation}
        />
      }
      center={
        title ? (
          <View style={styles.centerCopy}>
            <TextHeading
              variant={titleVariant === 'nav' ? 'nav' : 'section'}
              themeColor="deepOcean"
              numberOfLines={1}
              style={styles.title}
            >
              {title}
            </TextHeading>
            {subtitle ? (
              <TextParagraph variant="secondary" themeColor="textSecondary" numberOfLines={2}>
                {subtitle}
              </TextParagraph>
            ) : null}
          </View>
        ) : null
      }
      trailing={
        <HeaderActionsRow
          actions={resolvedActions.trailingActions}
          handlers={handlers}
          presentation={actionPresentation}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  brandSkeleton: {
    flex: 1,
    justifyContent: 'center',
  },
  centerCopy: {
    alignItems: 'center',
    gap: Spacing.half,
    width: '100%',
  },
  title: {
    textAlign: 'center',
  },
});
