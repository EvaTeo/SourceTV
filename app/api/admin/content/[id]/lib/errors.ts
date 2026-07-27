export class ContentRouteError extends Error {
  error: string;
  status: number;
  details?: unknown;

  constructor(options: {
    error: string;
    message: string;
    status?: number;
    details?: unknown;
  }) {
    super(options.message);

    this.name = "ContentRouteError";
    this.error = options.error;
    this.status = options.status ?? 400;
    this.details = options.details;
  }
}