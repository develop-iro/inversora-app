/** UI surfaces that can invoke SORA. */
export type AssistantSurface =
  | 'home'
  | 'fund-detail'
  | 'catalog'
  | 'ranking'
  | 'compare';

/** Assistant response source layer. */
export type AssistantResponseSource = 'glossary' | 'cache' | 'openai' | 'mock';

/** Request payload for `POST /assistant/explain`. */
export type AssistantExplainRequest = {
  surface: AssistantSurface;
  message: string;
  fund?: {
    isin: string;
  };
  locale?: 'es';
};

/** Response payload from `POST /assistant/explain`. */
export type AssistantExplainResponse = {
  text: string;
  title?: string;
  source: Exclude<AssistantResponseSource, 'mock'>;
  cached: boolean;
  disclaimer: string;
  relatedFundIsin?: string;
  promptVersion: string;
};

/** Normalized answer shape used by home search UI. */
export type SoraAnswer = {
  title: string;
  body: string;
  source: AssistantResponseSource;
  disclaimer: string;
  relatedFundIsin?: string;
};
