import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type InfoHintHostContextValue = {
  openId: string | null;
  requestOpen: (id: string) => void;
  requestClose: (id: string) => void;
};

const InfoHintHostContext = createContext<InfoHintHostContextValue | null>(null);

export function InfoHintHost({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const requestOpen = useCallback((id: string) => {
    setOpenId(id);
  }, []);

  const requestClose = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : current));
  }, []);

  const value = useMemo(
    () => ({ openId, requestOpen, requestClose }),
    [openId, requestOpen, requestClose],
  );

  return (
    <InfoHintHostContext.Provider value={value}>{children}</InfoHintHostContext.Provider>
  );
}

export function useInfoHintHost() {
  return useContext(InfoHintHostContext);
}
