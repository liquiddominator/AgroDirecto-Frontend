import { navigate } from '../app/router';
import { routes } from '../config/routes';
import { useAuth } from '../hooks/useAuth';

export function DashboardPage() {
  const { user, logout } = useAuth();

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
        <button type="button" className="ghost-button" onClick={handleLogout}>
          Cerrar sesion
        </button>
      </header>
    </main>
  );
}
