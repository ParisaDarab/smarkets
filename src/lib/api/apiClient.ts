// Requests are sent to a same-origin "/api" prefix, which Vite's dev
// server proxies to https://api.smarkets.com (see vite.config.ts). This
// sidesteps the browser CORS restriction we'd otherwise hit calling a
// third-party trading API directly from client-side JS.
const API_BASE_URL = '/api';

type SmarketsErrorBody = {
  error_type?: string;
  data?: unknown;
};

export class ApiError extends Error {
  status: number;
  errorType?: string;

  constructor(message: string, status: number, errorType?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorType = errorType;
  }
}

function humaniseErrorType(errorType: string): string {
  return errorType.replaceAll('_', ' ').toLowerCase();
}

type ApiClientOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
  /** Session token from a successful login; sent as `Authorization: Session-Token <token>` */
  token?: string | null;
};

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Session-Token ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    let errorType: string | undefined;

    try {
      const body = (await response.json()) as SmarketsErrorBody;
      if (body?.error_type) {
        errorType = body.error_type;
        message = humaniseErrorType(body.error_type);
      }
    } catch {
      // Response wasn't JSON (e.g. proxy/network failure) - fall back to status text.
    }

    throw new ApiError(message, response.status, errorType);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}