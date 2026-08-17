// Requests are sent to a same-origin "/api" prefix, which Vite's dev
// server proxies to https://api.smarkets.com (see vite.config.ts). This
// sidesteps the browser CORS restriction we'd otherwise hit calling a

import { humaniseErrorType } from "@/lib/i18n/errors";

// third-party trading API directly from client-side JS.
const API_BASE_URL = '/api';

export const UNAUTHORIZED_EVENT = 'smarkets:unauthorized';

/** Shape of Smarkets' JSON error responses, e.g. {"error_type":"INVALID_CREDENTIALS","data":"..."} */
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
    if (response.status === 401) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }

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

  const data = (await response.json()) as T;

  // Dev-only: prints every successful response straight to the console, so
  // you can check the real shape of events/markets/contracts/quotes
  // against the TypeScript types in types/markets/markets.ts without
  // digging through DevTools Network tab rows one by one. Vite strips this
  // whole block out of the production build automatically.
  if (import.meta.env.DEV) {
    console.log(`[smarkets api] ${rest.method ?? 'GET'} ${endpoint}`, data);
  }

  return data;
}