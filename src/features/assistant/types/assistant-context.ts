/** UI surfaces that can invoke SORA. */
export type AssistantSurface =
  | 'home'
  | 'fund-detail'
  | 'catalog'
  | 'ranking'
  | 'compare';

/** Assistant response source layer. */
export type AssistantResponseSource = 'glossary' | 'cache' | 'openai' | 'mock';

/** Shared fund reference sent to the assistant API. */
export type AssistantFundRef = {
  isin: string;
};

/** Request payload for `POST /assistant/explain`. */
export type AssistantExplainRequest = {
  surface: AssistantSurface;
  message: string;
  fund?: AssistantFundRef;
  locale?: 'es';
};

/** Request payload for `POST /assistant/chat`. */
export type AssistantChatRequest = {
  surface: AssistantSurface;
  message: string;
  sessionId?: string;
  fund?: AssistantFundRef;
  funds?: readonly AssistantFundRef[];
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

/** Response payload from `POST /assistant/chat`. */
export type AssistantChatResponse = AssistantExplainResponse & {
  sessionId?: string;
};

/** Single turn shown in conversational SORA UI. */
export type AssistantChatTurn = {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  response?: AssistantChatResponse;
};

/** Normalized answer shape used by home search UI. */
export type SoraAnswer = {
  title: string;
  body: string;
  source: AssistantResponseSource;
  disclaimer: string;
  relatedFundIsin?: string;
};
