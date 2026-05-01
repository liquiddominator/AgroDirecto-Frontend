import { useEffect, useState } from 'react';
import { navigate } from '../../../app/router';
import { routes } from '../../../config/routes';
import { useAuth } from '../../../hooks/useAuth';
import { isApiError } from '../../../lib/api/apiError';
import * as adminUsersApi from '../api/adminUsersApi';
import type { AdminUserSummary } from '../types/adminTypes';

export function AdminUsersPage() {
  const { logout } = useAuth();
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    adminUsersApi
      .listAdminUsers()
      .then((response) => {
        if (active) {
          setUsers(response);
        }
      })
      .catch((caughtError) => {
        if (active) {
          setError(resolveErrorMessage(caughtError));
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    await logout();
    navigate(routes.login);
  }

  return (
    <main className="profile-view">
      <header className="topbar">
        <div>
          <strong>AgroDirecto</strong>
          <span>Gestion de usuarios</span>
        </div>
        <nav className="topbar-actions" aria-label="Navegacion admin">
          <button type="button" className="ghost-button" onClick={() => navigate(routes.dashboard)}>
            Panel
          </button>
          <button type="button" className="ghost-button" onClick={handleLogout}>
            Cerrar sesion
          </button>
        </nav>
      </header>

      <section className="profile-content">
        <div className="profile-card">
          <div className="section-heading">
            <p>Administracion</p>
            <h1>Usuarios</h1>
          </div>

          {error && <p className="form-error">{error}</p>}
          {isLoading ? (
            <p className="muted-text">Cargando usuarios...</p>
          ) : (
            <div className="data-table">
              <div className="data-row data-head">
                <span>Usuario</span>
                <span>Rol</span>
                <span>Estado</span>
                <span></span>
              </div>
              {users.map((user) => (
                <div className="data-row" key={user.id}>
                  <span>
                    <strong>{user.fullName}</strong>
                    <small>{user.email}</small>
                  </span>
                  <span>{formatRole(user.primaryRole)}</span>
                  <span>{formatStatus(user.status)}</span>
                  <span>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => navigate(`${routes.adminUsers}/${user.id}`)}
                    >
                      Ver detalle
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function resolveErrorMessage(error: unknown) {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'No se pudo cargar la lista de usuarios.';
}

function formatRole(role: string | null) {
  const labels: Record<string, string> = {
    PRODUCER: 'Productor',
    BUYER: 'Comprador',
    CARRIER: 'Transportista',
    ADMIN: 'Administrador',
  };
  return role ? labels[role] ?? role : 'Sin rol';
}

function formatStatus(status: string) {
  const labels: Record<string, string> = {
    REGISTERED: 'Registrado',
    PENDING_VERIFICATION: 'Pendiente',
    VERIFIED: 'Verificado',
    REJECTED: 'Rechazado',
    INCOMPLETE: 'Incompleto',
    SUSPENDED: 'Suspendido',
    LOCKED: 'Bloqueado',
  };
  return labels[status] ?? status;
}
