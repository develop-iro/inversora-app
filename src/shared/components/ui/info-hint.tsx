import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useEffect, useId, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import {
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { modal } from '@/core/overlay/modal';
import { useInfoHintHost } from '@/shared/components/ui/info-hint-host';
import {
  INFO_HINT_POPUP_ESTIMATED_HEIGHT,
  INFO_HINT_POPUP_MAX_WIDTH,
  resolveInfoHintPopupPosition,
  type InfoHintPlacement,
  type InfoHintPopupPosition,
  type InfoHintPopupSize,
} from '@/shared/components/ui/info-hint-popup-position';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { usePlatformCapabilities } from '@/shared/hooks/use-platform-capabilities';
import { useWebHover, type WebHoverProps } from '@/shared/hooks/use-web-hover';
import { useTheme } from '@/shared/hooks/use-theme';
import {
  isWeb,
  shouldShowInfoHint,
  type InfoHintSurface,
} from '@/shared/platform/capabilities';
import { webElevationShadow } from '@/shared/theme/theme';
import { cn } from '@/shared/utils/cn';

export type { InfoHintSurface } from '@/shared/platform/capabilities';
export type { InfoHintPlacement } from '@/shared/components/ui/info-hint-popup-position';

export type InfoHintTriggerProps = {
  term: string;
  explanation: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  placement?: InfoHintPlacement;
  surface?: InfoHintSurface;
};

type PopupPosition = InfoHintPopupPosition;

function getWebViewportSize(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function getPopupDomRect(node: View | null): InfoHintPopupSize | null {
  if (!node || typeof document === 'undefined') {
    return null;
  }

  const element = node as unknown as HTMLElement;
  if (typeof element.getBoundingClientRect !== 'function') {
    return null;
  }

  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  return {
    width: rect.width,
    height: rect.height,
  };
}

/**
 * Opens the centered glossary dialog with blur scrim (native and narrow web).
 *
 * @param term - Glossary term shown as dialog title.
 * @param explanation - Plain-language definition body.
 */
export function openInfoHintExplanationSheet(term: string, explanation: string): void {
  modal.openAlert({
    title: term,
    message: explanation,
    backdrop: 'blur-scrim',
    buttons: [{ label: 'Entendido', variant: 'primary' }],
  });
}

function InfoHintWebPopup({
  term,
  explanation,
  position,
  theme,
  hoverProps,
  popupRef,
  onPopupLayout,
}: {
  term: string;
  explanation: string;
  position: PopupPosition;
  theme: ReturnType<typeof useTheme>;
  hoverProps: WebHoverProps;
  popupRef: RefObject<View | null>;
  onPopupLayout: () => void;
}) {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <View
      ref={popupRef}
      onLayout={onPopupLayout}
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

/** Compact glossary trigger — hover portal on web desktop, centered dialog elsewhere. */
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
  const popupRef = useRef<View>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [focused, setFocused] = useState(false);
  const [localOpen, setLocalOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null);

  const isOpenInHost = host ? host.openId === hintId : localOpen;
  const showPopup = useHoverPopup && (isOpenInHost || focused);

  const updatePopupPosition = useCallback(
    (measuredPopupSize?: InfoHintPopupSize) => {
      anchorRef.current?.measureInWindow((x, y, width, height) => {
        const measuredSize =
          measuredPopupSize ??
          getPopupDomRect(popupRef.current) ?? {
            width: INFO_HINT_POPUP_MAX_WIDTH,
            height: INFO_HINT_POPUP_ESTIMATED_HEIGHT,
          };
        const viewport = getWebViewportSize();

        setPopupPosition(
          resolveInfoHintPopupPosition({
            anchor: { x, y, width, height },
            viewport,
            placement,
            popupSize: measuredSize,
          }),
        );
      });
    },
    [placement],
  );

  const handlePopupLayout = useCallback(() => {
    const measuredSize = getPopupDomRect(popupRef.current);
    if (measuredSize) {
      updatePopupPosition(measuredSize);
    }
  }, [updatePopupPosition]);

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

  const openSheet = useCallback(() => {
    openInfoHintExplanationSheet(term, explanation);
  }, [explanation, term]);

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
              : 'Mostrar explicación sencilla en un diálogo'
          }
          accessibilityState={{ expanded: showPopup }}
          hitSlop={8}
          onPress={useHoverPopup ? undefined : openSheet}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="min-h-6 min-w-6 items-center justify-center rounded-full active:opacity-75"
        >
          <MaterialCommunityIcons
            name={showPopup ? 'information' : 'information-outline'}
            size={14}
            color={theme.primary}
          />
        </Pressable>
      </View>

      {showPopup && popupPosition ? (
        <InfoHintWebPopup
          term={term}
          explanation={explanation}
          position={popupPosition}
          theme={theme}
          hoverProps={popupHoverProps}
          popupRef={popupRef}
          onPopupLayout={handlePopupLayout}
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
