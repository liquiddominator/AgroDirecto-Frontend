import { navigate } from '../app/router';
import { routes } from '../config/routes';
import { useAuth } from '../hooks/useAuth';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const isAdmin = user?.roles.includes('ADMIN') ?? false;
  const isVerified = user?.status === 'VERIFIED';

  async function handleLogout() {
    await logout();
    navigate(routes.login);
  }

  return (
    <main className="empty-view">
      <header className="topbar">
        <div>
          <strong>AgroDirecto</strong>
          <span>{user?.fullName}</span>
        </div>
        <nav className="topbar-actions" aria-label="Navegacion principal">
          <button type="button" className="ghost-button" onClick={() => navigate(routes.profile)}>
            Mi perfil
          </button>
          {isAdmin && (
            <button type="button" className="ghost-button" onClick={() => navigate(routes.adminUsers)}>
              Usuarios
            </button>
          )}
          <button type="button" className="ghost-button" onClick={handleLogout}>
            Cerrar sesion
          </button>
        </nav>
      </header>
      <section className="dashboard-placeholder" aria-label="Panel principal">
        {!isAdmin && !isVerified && (
          <div className="readonly-panel">
            <span className="status-pending">Modo solo lectura</span>
            <h1>Complete la verificacion para usar las funciones criticas</h1>
            <button type="button" className="primary-button" onClick={() => navigate(routes.profile)}>
              Ir a documentos
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
