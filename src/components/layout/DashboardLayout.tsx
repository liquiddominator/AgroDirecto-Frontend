import { Outlet, useLocation } from "react-router-dom";
import { Sidebar, type MenuItem } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAuth } from "../../hooks/useAuth";
import { navigate } from "../../app/router";
import { routes } from "../../config/routes";
import { ROLES } from "../../config/roles";

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const isAdmin = user?.roles.includes(ROLES.ADMIN) ?? false;
  const location = useLocation();

  async function handleLogout() {
    await logout();
    navigate(routes.login);
  }

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', path: routes.dashboard || '/dashboard' },
    { id: 'productos', label: 'Productos', path: '/productos', roles: [ROLES.PRODUCER, ROLES.BUYER] },
    { id: 'pedidos', label: 'Pedidos', path: '/pedidos', roles: [ROLES.PRODUCER, ROLES.BUYER, ROLES.CARRIER] },
    { id: 'geolocalizacion', label: 'Geolocalización', path: '/geolocalizacion', roles: [ROLES.PRODUCER, ROLES.CARRIER] },
    { id: 'documentos', label: 'Documentos', path: '/documentos', roles: [ROLES.PRODUCER, ROLES.BUYER, ROLES.CARRIER] },
    { id: 'usuarios', label: 'Usuarios', path: routes.adminUsers || '/admin/users', roles: [ROLES.ADMIN] },
    { id: 'perfil', label: 'Perfil', path: routes.profile || '/perfil' },
    { id: 'configuracion', label: 'Configuración', path: '/configuracion' },
  ];

  const allowedMenuItems = menuItems.filter(
    (item) => !item.roles || item.roles.some((role) => user?.roles?.includes(role))
  );

  const activeMenuItem = allowedMenuItems.find((m) => location.pathname === m.path || location.pathname.startsWith(m.path + '/')) || allowedMenuItems[0];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar menuItems={allowedMenuItems} activePath={location.pathname} onLogout={handleLogout} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={activeMenuItem?.label} userName={user?.fullName} isAdmin={isAdmin} />
        <main className="flex-1 overflow-y-auto p-8" aria-label="Panel principal">
          <Outlet />
        </main>
      </div>
    </div>
  );
}