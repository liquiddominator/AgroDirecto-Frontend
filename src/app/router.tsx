import { useEffect, useState, type ReactNode } from 'react';
import { routes } from '../config/routes';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { useAuth } from '../hooks/useAuth';

export function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function Router() {
  const pathname = usePathname();

  if (pathname === '/' || pathname === routes.login) {
    return (
      <PublicOnly>
        <LoginPage />
      </PublicOnly>
    );
  }

  if (pathname === routes.register) {
    return (
      <PublicOnly>
        <RegisterPage />
      </PublicOnly>
    );
  }

  if (pathname === routes.dashboard) {
    return (
      <Protected>
        <DashboardPage />
      </Protected>
    );
  }

  return <NotFoundPage />;
}

function Protected({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate(routes.login);
    }
  }, [isAuthenticated, isInitializing]);

  if (isInitializing) {
    return <div className="screen-message">Cargando sesion...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      navigate(routes.dashboard);
    }
  }, [isAuthenticated, isInitializing]);

  if (isInitializing) {
    return <div className="screen-message">Cargando sesion...</div>;
  }

  if (isAuthenticated) {
    return null;
  }

  return children;
}

function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    function handlePopState() {
      setPathname(window.location.pathname);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return pathname;
}
