import { useCallback, useRef } from 'react';

import { isWeb } from '@/shared/platform/capabilities';

type WebHoverHandlers = {
  onHoverIn: () => void;
  onHoverOut: () => void;
};

export type WebHoverProps = {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

/** Stable mouse enter/leave on web (avoids nested Pressable hover flicker). */
export function useWebHover({ onHoverIn, onHoverOut }: WebHoverHandlers): WebHoverProps {
  const depthRef = useRef(0);

  const handleEnter = useCallback(() => {
    depthRef.current += 1;
    if (depthRef.current === 1) {
      onHoverIn();
    }
  }, [onHoverIn]);

  const handleLeave = useCallback(() => {
    depthRef.current = Math.max(0, depthRef.current - 1);
    if (depthRef.current === 0) {
      onHoverOut();
    }
  }, [onHoverOut]);

  if (!isWeb) {
    return {};
  }

  return {
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,
  };
}
