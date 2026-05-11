import { navigate } from '../app/router';
import { routes } from '../config/routes';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../config/roles';

export function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.roles.includes(ROLES.ADMIN) ?? false;
  const isVerified = user?.status === 'VERIFIED';

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-bold text-green-950">
          ¡Hola, {user?.fullName?.split(' ')[0] || 'Usuario'}!
        </h2>
        <p className="mt-2 text-slate-600">Bienvenido al panel principal de AgroDirecto.</p>
      </div>

      {!isAdmin && !isVerified && (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm sm:p-8">
          <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
            Modo solo lectura
          </span>
          <h3 className="mt-4 font-display text-xl font-bold text-yellow-950">
            Complete la verificacion para usar las funciones criticas
          </h3>
          <p className="mb-6 mt-2 text-sm text-yellow-800">
            Para empezar a publicar productos o realizar compras, necesitamos verificar su identidad y documentos.
          </p>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-green-800 px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-green-900/20 transition hover:bg-green-900"
            onClick={() => navigate(routes.profile)}
          >
            Ir a documentos
          </button>
        </div>
      )}
    </div>
  );
}
