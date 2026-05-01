import type { AuthResponse, AuthSession } from '../../features/auth/types/authTypes';

const AUTH_SESSION_KEY = 'agrodirecto.auth.session';

export function getStoredSession(): AuthSession | null {
  const rawSession = window.localStorage.getItem(AUTH_SESSION_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function storeSession(response: AuthResponse): AuthSession {
  const session: AuthSession = {
    tokenType: response.tokenType,
    accessToken: response.accessToken,
    accessTokenExpiresAt: response.accessTokenExpiresAt,
    refreshToken: response.refreshToken,
    refreshTokenExpiresAt: response.refreshTokenExpiresAt,
    user: response.user,
  };
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  return session;
}

export function updateStoredUser(user: AuthSession['user']): AuthSession | null {
  const currentSession = getStoredSession();
  if (!currentSession) {
    return null;
  }
  const nextSession = { ...currentSession, user };
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(nextSession));
  return nextSession;
}

export function clearStoredSession() {
  window.localStorage.removeItem(AUTH_SESSION_KEY);
}
