export type AppErrorCode =
  | 'STORAGE_READ_FAILED'
  | 'STORAGE_WRITE_FAILED'
  | 'SCORING_INVALID_INPUT'
  | 'FUNDS_FETCH_FAILED'
  | 'API_REQUEST_FAILED'
  | 'API_INVALID_RESPONSE';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly cause?: unknown;
  readonly status?: number;

  constructor(code: AppErrorCode, message: string, cause?: unknown, status?: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.cause = cause;
    this.status = status;
  }
}
