import { useEffect, useState } from 'react';
import { navigate } from '../../../app/router';
import { routes } from '../../../config/routes';
import { isApiError } from '../../../lib/api/apiError';
import * as adminUsersApi from '../api/adminUsersApi';
import type { AdminUserSummary } from '../types/adminTypes';
import { ROLES } from '../../../config/roles';
import { Eye, Shield, User, Truck, ShoppingBag, CheckCircle2, AlertCircle, XCircle, Clock, Users } from 'lucide-react';

export function AdminUsersPage() {
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

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto space-y-8 px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4 w-full">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-green-800">Administración</p>
                <h1 className="mt-1 font-display text-2xl font-bold text-green-950">Usuarios</h1>
              </div>
            </div>
          </div>

          {error && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
          {isLoading ? (
            <p className="text-sm leading-6 text-slate-600">Cargando usuarios...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y border-b border-slate-200 divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuario</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Rol</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-900">{user.fullName}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20">
                          <RoleIcon role={user.primaryRole} className="w-3 h-3 mr-1" />
                          {formatRole(user.primaryRole)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all"
                          onClick={() => navigate(`${routes.adminUsers}/${user.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-1.5 text-slate-400" />
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
    [ROLES.PRODUCER]: 'Productor',
    [ROLES.BUYER]: 'Comprador',
    [ROLES.CARRIER]: 'Transportista',
    [ROLES.ADMIN]: 'Administrador',
  };
  return role ? labels[role] ?? role : 'Sin rol';
}

function RoleIcon({ role, className }: { role: string | null, className?: string }) {
  switch (role) {
    case ROLES.ADMIN: return <Shield className={className} />;
    case ROLES.PRODUCER: return <User className={className} />;
    case ROLES.BUYER: return <ShoppingBag className={className} />;
    case ROLES.CARRIER: return <Truck className={className} />;
    default: return <User className={className} />;
  }
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string, color: string, bg: string, icon: React.ElementType }> = {
    VERIFIED: { label: 'Verificado', color: 'text-green-700', bg: 'bg-green-50 ring-green-600/20', icon: CheckCircle2 },
    PENDING_VERIFICATION: { label: 'Pendiente', color: 'text-yellow-700', bg: 'bg-yellow-50 ring-yellow-600/20', icon: Clock },
    REJECTED: { label: 'Rechazado', color: 'text-red-700', bg: 'bg-red-50 ring-red-600/20', icon: XCircle },
    INCOMPLETE: { label: 'Incompleto', color: 'text-slate-700', bg: 'bg-slate-50 ring-slate-600/20', icon: AlertCircle },
    REGISTERED: { label: 'Registrado', color: 'text-blue-700', bg: 'bg-blue-50 ring-blue-600/20', icon: User },
    SUSPENDED: { label: 'Suspendido', color: 'text-orange-700', bg: 'bg-orange-50 ring-orange-600/20', icon: XCircle },
    LOCKED: { label: 'Bloqueado', color: 'text-red-900', bg: 'bg-red-100 ring-red-900/20', icon: XCircle },
  };
  
  const conf = config[status] || { label: status, color: 'text-slate-700', bg: 'bg-slate-50 ring-slate-600/20', icon: AlertCircle };
  const Icon = conf.icon;
  
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${conf.bg} ${conf.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {conf.label}
    </span>
  );
}
