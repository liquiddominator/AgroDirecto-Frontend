import { navigate } from '../../app/router';
import { routes } from '../../config/routes';

interface TopbarProps {
  title?: string;
  userName?: string;
  isAdmin: boolean;
}

export function Topbar({ title, userName, isAdmin }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
      <h1 className="font-display text-lg font-bold text-slate-800">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-600">{userName}</span>
        {isAdmin && (
          <button
            type="button"
            className="text-sm font-semibold text-green-700 transition hover:text-green-900"
            onClick={() => navigate(routes.adminUsers)}
          >
            Usuarios
          </button>
        )}
      </div>
    </header>
  );
}