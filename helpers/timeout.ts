export abstract class FetchService {
  abstract fetch(request: Request, init?: RequestInit): Promise<Response>;
}

export abstract class TimeoutConfig {
  abstract timeout: number;
  abstract fetchService: FetchService;
  abortController?: AbortController;
}

export class TimeoutError extends Error {
  public request: unknown;

  constructor(request: Request) {
    super(`Request timed out: ${request.method} ${request.url}`);
    this.name = "TimeoutError";
    this.request = request;
  }
}

export default async function timeout(
  request: Request,
  init: RequestInit,
  config: TimeoutConfig
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      config.abortController?.abort();
      reject(new TimeoutError(request));
    }, config.timeout);

    void config.fetchService
      .fetch(request, init)
      .then(resolve)
      .catch(reject)
      .then(() => {
        clearTimeout(timeoutId);
      });
  });
}
