import { useMemo, useState } from 'react';

import { SoraChatSheet } from '@/features/assistant/components/sora-chat-sheet';
import { shouldApplyBeginnerSurfaceGuards } from '@/features/funds/utils/beginner-eligibility';
import { useEducationalProfile } from '@/features/learn/hooks/use-educational-profile';
import { Header } from '@/shared/components/headers';

/**
 * Dashboard header with learn + SORA actions and a shared assistant sheet.
 */
export function AppHeaderWithSora() {
  const [isSoraVisible, setIsSoraVisible] = useState(false);
  const [soraSession, setSoraSession] = useState(0);
  const { profile } = useEducationalProfile();
  const preferLearnTabEntry = shouldApplyBeginnerSurfaceGuards(profile);

  const trailingActions = useMemo(() => {
    if (preferLearnTabEntry) {
      return ['sora'] as const;
    }

    return ['learn', 'sora'] as const;
  }, [preferLearnTabEntry]);

  return (
    <>
      <Header
        showBrand
        trailingActions={trailingActions}
        onAction={{
          sora: () => {
            setSoraSession((session) => session + 1);
            setIsSoraVisible(true);
          },
        }}
      />
      <SoraChatSheet
        key={`app-sora-${soraSession}`}
        visible={isSoraVisible}
        onClose={() => {
          setIsSoraVisible(false);
        }}
        surface="home"
        conversationMode
      />
    </>
  );
}
