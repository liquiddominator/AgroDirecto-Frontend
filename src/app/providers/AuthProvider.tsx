import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as authApi from '../../features/auth/api/authApi';
import type {
  AuthSession,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '../../features/auth/types/authTypes';
import {
  clearStoredSession,
  getStoredSession,
  storeSession,
  updateStoredUser,
} from '../../lib/storage/tokenStorage';

interface AuthContextValue {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (request: LoginRequest) => Promise<AuthUser>;
  register: (request: RegisterRequest) => Promise<AuthUser>;
  refreshUser: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => getStoredSession());
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const storedSession = getStoredSession();
      if (!storedSession) {
        if (active) {
          setSession(null);
          setIsInitializing(false);
        }
        return;
      }

      try {
        const user = await authApi.getCurrentUser();
        const nextSession = updateStoredUser(user);
        if (active) {
          setSession(nextSession);
        }
      } catch {
        clearStoredSession();
        if (active) {
          setSession(null);
        }
      } finally {
        if (active) {
          setIsInitializing(false);
        }
      }
    }

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (request: LoginRequest) => {
    const response = await authApi.login(request);
    const nextSession = storeSession(response);
    setSession(nextSession);
    return nextSession.user;
  }, []);

  const register = useCallback(async (request: RegisterRequest) => {
    const response = await authApi.register(request);
    const nextSession = storeSession(response);
    setSession(nextSession);
    return nextSession.user;
  }, []);

  const refreshUser = useCallback(async () => {
    const currentSession = getStoredSession();
    if (!currentSession) {
      return null;
    }
    const user = await authApi.getCurrentUser();
    const nextSession = updateStoredUser(user);
    setSession(nextSession);
    return user;
  }, []);

  const logout = useCallback(async () => {
    const currentSession = getStoredSession();
    clearStoredSession();
    setSession(null);

    if (currentSession?.refreshToken) {
      try {
        await authApi.logout(currentSession.refreshToken);
      } catch {
        // The local session is already cleared; backend logout failure must not keep the user signed in.
      }
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      isAuthenticated: Boolean(session?.accessToken),
      isInitializing,
      login,
      register,
      refreshUser,
      logout,
    }),
    [isInitializing, login, logout, refreshUser, register, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
