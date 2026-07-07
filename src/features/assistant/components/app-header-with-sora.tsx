import { useState } from 'react';

import { SoraChatSheet } from '@/features/assistant/components/sora-chat-sheet';
import { Header } from '@/shared/components/headers';

/**
 * Dashboard header with learn + SORA actions and a shared assistant sheet.
 */
export function AppHeaderWithSora() {
  const [isSoraVisible, setIsSoraVisible] = useState(false);
  const [soraSession, setSoraSession] = useState(0);

  return (
    <>
      <Header
        showBrand
        trailingActions={['learn', 'sora']}
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
