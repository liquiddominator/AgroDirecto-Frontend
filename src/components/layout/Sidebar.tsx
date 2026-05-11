import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MapPin,
  FileText,
  User,
  Settings,
  Leaf,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/roles';


export interface MenuItem {
  id: string;
  label: string;
  path: string;
  roles?: string[];
}

interface SidebarProps {
  menuItems: MenuItem[];
  activePath: string;
  onLogout: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  productos: Package,
  pedidos: ShoppingCart,
  geolocalizacion: MapPin,
  documentos: FileText,
  usuarios: User,
  perfil: User,
  configuracion: Settings,
};

export function Sidebar({ menuItems, activePath, onLogout }: SidebarProps) {
  const { user } = useAuth();
  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'US';

  const role = user?.roles?.includes(ROLES.ADMIN) ? 'Administrador' : 'Productor';

  return (
    <aside
      className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-200"
      style={{ background: '#1B4332' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-green-800 px-6 py-5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl shadow-md"
          style={{ background: '#52B788' }}
        >
          <Leaf className="h-5 w-5 text-white" />
        </div>
        <div>
          <span
            className="text-base text-white"
            style={{ fontWeight: 700, letterSpacing: '-0.01em' }}
          >
            Agro Directo
          </span>
          <p className="text-xs text-green-300" style={{ lineHeight: 1.2 }}>
            Marketplace Agropecuario
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p
          className="px-3 pb-2 pt-1 text-xs uppercase text-green-400"
          style={{ letterSpacing: '0.08em', fontWeight: 600 }}
        >
          Menú Principal
        </p>
        {menuItems.map((item) => {
          const isActive = activePath === item.path || activePath.startsWith(item.path + '/');
          const Icon = iconMap[item.id] || LayoutDashboard;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 ${
                isActive
                  ? 'font-semibold text-white shadow-md bg-green-600'
                  : 'font-normal text-green-200 hover:bg-green-800 hover:text-white'
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  isActive ? 'bg-green-500' : 'bg-green-900'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-yellow-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile and Logout */}
      <div className="space-y-3 border-t border-green-800 px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl bg-green-800/50 px-2 py-2.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm text-white"
            style={{
              background: 'linear-gradient(135deg, #52B788, #2D6A4F)',
              fontWeight: 700,
            }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-sm text-white"
              style={{ fontWeight: 600 }}
            >
              {user?.fullName || 'Usuario'}
            </p>
            <p className="truncate text-xs text-green-300">{role}</p>
          </div>
          <div className="ml-auto h-2 w-2 shrink-0 rounded-full bg-green-400" />
        </div>

        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-green-200 transition-all duration-150 hover:bg-green-800 hover:text-white"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-900">
            <LogOut className="h-4 w-4" />
          </div>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}