import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useInfoHintHost } from '@/shared/components/ui/info-hint-host';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { usePlatformCapabilities } from '@/shared/hooks/use-platform-capabilities';
import { useWebHover, type WebHoverProps } from '@/shared/hooks/use-web-hover';
import { useTheme } from '@/shared/hooks/use-theme';
import { useThemeShadows } from '@/shared/hooks/use-theme-shadows';
import {
  isWeb,
  shouldShowInfoHint,
  type InfoHintSurface,
} from '@/shared/platform/capabilities';
import { Radius, Spacing, webElevationShadow } from '@/shared/theme/theme';

export type { InfoHintSurface } from '@/shared/platform/capabilities';

export type InfoHintPlacement = 'below' | 'beside';

export type InfoHintTriggerProps = {
  term: string;
  explanation: string;
  style?: StyleProp<ViewStyle>;
  placement?: InfoHintPlacement;
  surface?: InfoHintSurface;
};

type PopupPosition = {
  top: number;
  left: number;
};

function InfoHintWebPopup({
  term,
  explanation,
  position,
  theme,
  hoverProps,
  shadows,
}: {
  term: string;
  explanation: string;
  position: PopupPosition;
  theme: ReturnType<typeof useTheme>;
  hoverProps: WebHoverProps;
  shadows: ReturnType<typeof useThemeShadows>;
}) {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <View
      {...hoverProps}
      accessibilityRole="text"
      accessibilityLabel={`${term}. ${explanation}`}
      style={[
        styles.portalPopup,
        shadows.card,
        {
          position: 'fixed',
          top: position.top,
          left: position.left,
          backgroundColor: theme.surface,
          borderColor: theme.border,
          boxShadow: webElevationShadow(theme),
        } as ViewStyle,
      ]}
    >
      <TextLabel variant="meta" themeColor="deepOcean" style={styles.popupTerm}>
        {term}
      </TextLabel>
      <TextParagraph variant="secondary" themeColor="textSecondary" style={styles.popupBody}>
        {explanation}
      </TextParagraph>
    </View>,
    document.body,
  );
}

/** Compact glossary trigger — hover portal on web desktop, tap-to-expand elsewhere. */
export function InfoHintTrigger({
  term,
  explanation,
  style,
  placement = 'below',
  surface = 'catalog',
}: InfoHintTriggerProps) {
  const theme = useTheme();
  const shadows = useThemeShadows();
  const hintId = useId();
  const host = useInfoHintHost();
  const { supportsInfoHintPopover } = usePlatformCapabilities();
  const useHoverPopup = supportsInfoHintPopover;
  const anchorRef = useRef<View>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [expanded, setExpanded] = useState(false);
  const [focused, setFocused] = useState(false);
  const [localOpen, setLocalOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null);

  const isOpenInHost = host ? host.openId === hintId : localOpen;
  const showPopup = useHoverPopup && (isOpenInHost || focused);

  const updatePopupPosition = useCallback(() => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      if (placement === 'beside') {
        setPopupPosition({
          top: y - Spacing.xs,
          left: x + width + Spacing.sm,
        });
        return;
      }

      setPopupPosition({
        top: y + height + Spacing.xs,
        left: x,
      });
    });
  }, [placement]);

  useEffect(() => {
    if (!showPopup) {
      return;
    }

    updatePopupPosition();

    if (!isWeb || typeof window === 'undefined') {
      return;
    }

    const handleLayout = () => updatePopupPosition();
    window.addEventListener('scroll', handleLayout, true);
    window.addEventListener('resize', handleLayout);

    return () => {
      window.removeEventListener('scroll', handleLayout, true);
      window.removeEventListener('resize', handleLayout);
    };
  }, [showPopup, updatePopupPosition]);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openPopup = useCallback(() => {
    clearCloseTimer();
    if (host) {
      host.requestOpen(hintId);
    } else {
      setLocalOpen(true);
    }
    updatePopupPosition();
  }, [clearCloseTimer, host, hintId, updatePopupPosition]);

  const closePopup = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      if (host) {
        host.requestClose(hintId);
      } else {
        setLocalOpen(false);
      }
      closeTimerRef.current = null;
    }, 140);
  }, [clearCloseTimer, host, hintId]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  const hoverProps = useWebHover({
    onHoverIn: openPopup,
    onHoverOut: closePopup,
  });

  const popupHoverProps = useWebHover({
    onHoverIn: openPopup,
    onHoverOut: closePopup,
  });

  const toggle = useCallback(() => {
    setExpanded((current) => !current);
  }, []);

  const handleFocus = useCallback(() => {
    if (useHoverPopup) {
      setFocused(true);
      openPopup();
    }
  }, [useHoverPopup, openPopup]);

  const handleBlur = useCallback(() => {
    if (useHoverPopup) {
      setFocused(false);
      closePopup();
    }
  }, [useHoverPopup, closePopup]);

  if (!shouldShowInfoHint(surface)) {
    return null;
  }

  return (
    <>
      <View
        ref={anchorRef}
        collapsable={false}
        pointerEvents="auto"
        {...(useHoverPopup ? hoverProps : {})}
        style={[styles.wrapper, useHoverPopup && styles.wrapperWeb, style]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${term}. ${explanation}`}
          accessibilityHint={
            useHoverPopup
              ? 'Pasa el ratón o enfoca para ver la explicación'
              : expanded
                ? 'Ocultar explicación'
                : 'Mostrar explicación sencilla'
          }
          accessibilityState={{ expanded: showPopup || expanded }}
          hitSlop={8}
          onPress={useHoverPopup ? undefined : toggle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={({ pressed }) => [styles.iconButton, pressed && !useHoverPopup && styles.iconPressed]}
        >
          <MaterialCommunityIcons
            name={showPopup || expanded ? 'information' : 'information-outline'}
            size={14}
            color={theme.primary}
          />
        </Pressable>

        {!useHoverPopup && expanded ? (
          <TextParagraph variant="secondary" themeColor="textSecondary" style={styles.explanation}>
            {explanation}
          </TextParagraph>
        ) : null}
      </View>

      {showPopup && popupPosition ? (
        <InfoHintWebPopup
          term={term}
          explanation={explanation}
          position={popupPosition}
          theme={theme}
          shadows={shadows}
          hoverProps={popupHoverProps}
        />
      ) : null}
    </>
  );
}

export type InfoHintProps = {
  term: string;
  explanation: string;
  style?: StyleProp<ViewStyle>;
  surface?: InfoHintSurface;
};

export function InfoHint({ term, explanation, style, surface = 'detail' }: InfoHintProps) {
  return (
    <View style={[styles.labeledWrapper, style]}>
      <View style={styles.labelRow}>
        <TextLabel variant="meta" themeColor="textSecondary" style={styles.term}>
          {term}
        </TextLabel>
        <InfoHintTrigger term={term} explanation={explanation} surface={surface} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-start',
    maxWidth: 220,
  },
  wrapperWeb: {
    width: 24,
    maxWidth: 24,
    zIndex: 1,
  },
  labeledWrapper: {
    gap: Spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  term: {
    flexShrink: 1,
  },
  iconButton: {
    minWidth: 24,
    minHeight: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
  iconPressed: {
    opacity: 0.75,
  },
  portalPopup: {
    minWidth: 200,
    maxWidth: 280,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: Spacing.xs,
    zIndex: 9999,
  },
  popupTerm: {
    letterSpacing: 0.4,
  },
  popupBody: {
    lineHeight: 18,
  },
  explanation: {
    lineHeight: 18,
    marginTop: Spacing.xs,
  },
});
