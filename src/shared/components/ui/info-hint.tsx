import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useInfoHintHost } from '@/shared/components/ui/info-hint-host';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { usePlatformCapabilities } from '@/shared/hooks/use-platform-capabilities';
import { useWebHover, type WebHoverProps } from '@/shared/hooks/use-web-hover';
import { useTheme } from '@/shared/hooks/use-theme';
import {
  isWeb,
  shouldShowInfoHint,
  type InfoHintSurface,
} from '@/shared/platform/capabilities';
import { Spacing, webElevationShadow } from '@/shared/theme/theme';
import { cn } from '@/shared/utils/cn';

export type { InfoHintSurface } from '@/shared/platform/capabilities';

export type InfoHintPlacement = 'below' | 'beside';

export type InfoHintTriggerProps = {
  term: string;
  explanation: string;
  className?: string;
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
}: {
  term: string;
  explanation: string;
  position: PopupPosition;
  theme: ReturnType<typeof useTheme>;
  hoverProps: WebHoverProps;
}) {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <View
      {...hoverProps}
      accessibilityRole="text"
      accessibilityLabel={`${term}. ${explanation}`}
      className="z-[9999] min-w-[200px] max-w-[280px] gap-xs rounded-card border border-border bg-surface px-md py-sm shadow-card"
      // tailwind-exception: fixed portal position and web box shadow
      style={
        {
          position: 'fixed',
          top: position.top,
          left: position.left,
          boxShadow: webElevationShadow(theme),
        } as unknown as ViewStyle
      }
    >
      <TextLabel variant="meta" themeColor="deepOcean" className="tracking-[0.4px]">
        {term}
      </TextLabel>
      <TextParagraph variant="secondary" themeColor="textSecondary" className="leading-[18px]">
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
  className,
  style,
  placement = 'below',
  surface = 'catalog',
}: InfoHintTriggerProps) {
  const theme = useTheme(); // tailwind-exception: icon color and web popup shadow
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
        className={cn(
          'max-w-[220px] items-start',
          useHoverPopup && 'z-[1] w-6 max-w-6',
          className,
        )}
        style={style}
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
          className="min-h-6 min-w-6 items-center justify-center rounded-full active:opacity-75"
        >
          <MaterialCommunityIcons
            name={showPopup || expanded ? 'information' : 'information-outline'}
            size={14}
            color={theme.primary}
          />
        </Pressable>

        {!useHoverPopup && expanded ? (
          <TextParagraph variant="secondary" themeColor="textSecondary" className="mt-xs leading-[18px]">
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
          hoverProps={popupHoverProps}
        />
      ) : null}
    </>
  );
}

export type InfoHintProps = {
  term: string;
  explanation: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  surface?: InfoHintSurface;
};

export function InfoHint({ term, explanation, className, style, surface = 'detail' }: InfoHintProps) {
  return (
    <View className={cn('gap-xs', className)} style={style}>
      <View className="flex-row items-center gap-xs">
        <TextLabel variant="meta" themeColor="textSecondary" className="shrink">
          {term}
        </TextLabel>
        <InfoHintTrigger term={term} explanation={explanation} surface={surface} />
      </View>
    </View>
  );
}
