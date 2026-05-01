import { env } from '../../config/env';
import type { AuthResponse } from '../../features/auth/types/authTypes';
import { ApiError, type ApiErrorBody } from './apiError';
import { clearStoredSession, getStoredSession, storeSession } from '../storage/tokenStorage';

interface ApiRequestOptions extends RequestInit {
  auth?: boolean;
  retryOnUnauthorized?: boolean;
}

let refreshPromise: Promise<AuthResponse> | null = null;

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { auth = true, retryOnUnauthorized = true, headers, ...requestOptions } = options;
  const response = await fetch(buildUrl(path), {
    ...requestOptions,
    headers: buildHeaders(headers, auth),
  });

  if (response.status === 401 && auth && retryOnUnauthorized) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiRequest<T>(path, { ...options, retryOnUnauthorized: false });
    }
  }

  return parseResponse<T>(response);
}

export function toJsonBody(value: unknown) {
  return JSON.stringify(value);
}

async function refreshAccessToken(): Promise<AuthResponse | null> {
  const session = getStoredSession();
  if (!session?.refreshToken) {
    return null;
  }

  refreshPromise ??= fetch(buildUrl('/api/auth/refresh'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: session.refreshToken }),
  })
    .then((response) => parseResponse<AuthResponse>(response))
    .then((response) => {
      storeSession(response);
      return response;
    })
    .catch((error) => {
      clearStoredSession();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  try {
    return await refreshPromise;
  } catch {
    return null;
  }
}

function buildUrl(path: string) {
  return `${env.apiBaseUrl}${path}`;
}

function buildHeaders(headers: HeadersInit | undefined, auth: boolean): Headers {
  const result = new Headers(headers);
  if (!result.has('Content-Type')) {
    result.set('Content-Type', 'application/json');
  }

  const session = getStoredSession();
  if (auth && session?.accessToken) {
    result.set('Authorization', `${session.tokenType} ${session.accessToken}`);
  }

  return result;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('Content-Type') ?? '';
  const body = contentType.includes('application/json')
    ? ((await response.json()) as ApiErrorBody | T)
    : null;

  if (!response.ok) {
    throw new ApiError(response.status, body as ApiErrorBody | null, response.statusText);
  }

  return body as T;
}
