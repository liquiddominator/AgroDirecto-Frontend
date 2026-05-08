import { type ReactNode } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useParams } from 'react-router-dom';
import { routes } from '../config/routes';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { AdminUserDetailPage } from '../features/admin/pages/AdminUserDetailPage';
import { AdminUsersPage } from '../features/admin/pages/AdminUsersPage';
import { ProducerProfilePage } from '../features/producer/pages/ProducerProfilePage';
import { DashboardPage } from '../pages/DashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProductsPage } from '../features/products/pages/ProductsPage';
import { HomePage } from '../pages/HomePage';
import { useAuth } from '../hooks/useAuth';

function AdminUserDetailWrapper() {
  const { id } = useParams();
  return <AdminUserDetailPage userId={Number(id)} />;
}

function Protected({ children, requireRole }: { children: ReactNode; requireRole?: string }) {
  const { user, isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <div className="screen-message">Cargando sesion...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.login} replace />;
  }

  if (requireRole && !user?.roles.includes(requireRole)) {
    return <div className="screen-message">No tiene permisos para acceder a esta vista.</div>;
  }

  return children;
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <div className="screen-message">Cargando sesion...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={routes.dashboard || '/dashboard'} replace />;
  }

  return children;
}

export const appRouter = createBrowserRouter([
  {
    path: routes.login,
    element: <PublicOnly><LoginPage /></PublicOnly>
  },
  {
    path: routes.register,
    element: <PublicOnly><RegisterPage /></PublicOnly>
  },
  {
    path: '/',
    element: <Protected><HomePage /></Protected>,
    children: [
      { index: true, element: <Navigate to={routes.dashboard || '/dashboard'} replace /> },
      { path: routes.dashboard || '/dashboard', element: <DashboardPage /> },
      { path: routes.profile || '/perfil', element: <ProducerProfilePage /> },
      { path: '/productos', element: <ProductsPage /> },
      { path: routes.adminUsers || '/admin/users', element: <Protected requireRole="ADMIN"><AdminUsersPage /></Protected> },
      { path: '/admin/users/:id', element: <Protected requireRole="ADMIN"><AdminUserDetailWrapper /></Protected> }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);

export function navigate(path: string) {
  appRouter.navigate(path);
}

export function Router() {
  return <RouterProvider router={appRouter} />;
}
