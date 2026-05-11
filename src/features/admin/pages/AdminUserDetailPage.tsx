import { useEffect, useState } from 'react';
import { navigate } from '../../../app/router';
import { routes } from '../../../config/routes';
import * as adminUsersApi from '../api/adminUsersApi';
import type { AdminUserDetail } from '../types/adminTypes';
import { DocumentList, getRequiredDocuments } from '../../verification/components/VerificationDocumentsPanel';
import * as verificationApi from '../../verification/api/verificationApi';
import type { ReviewDecision } from '../../verification/types/verificationTypes';
import { resolveErrorMessage } from '../../../utils/errorUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, ArrowLeft, UserCircle, Briefcase, FileText, CheckCircle2, Clock, AlertCircle, Shield, User, ShoppingBag, Truck, Check } from 'lucide-react';
import { toast } from 'sonner';
import { LocationMap } from '../../../components/ui/LocationMap';
import { ROLES } from '../../../config/roles';

const profileKeyLabels: Record<string, string> = {
  producerType: 'Tipo de productor',
  farmName: 'Nombre de finca',
  municipality: 'Municipio',
  province: 'Provincia',
  department: 'Departamento',
  experienceYears: 'Años de experiencia',
  geoLatitude: 'Latitud GPS',
  geoLongitude: 'Longitud GPS',
  buyerType: 'Tipo de comprador',
  businessName: 'Nombre comercial',
  cityOrPurchaseZone: 'Ciudad o zona de compra',
  transportType: 'Tipo de transporte',
  loadCapacityKg: 'Capacidad de carga (kg)',
  operationZone: 'Zona de operación',
  driverLicenseNumber: 'Número de licencia',
  vehiclePlate: 'Placa del vehículo',
};

function formatProfileValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return 'No especificado';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  return String(value);
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
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${conf.bg} ${conf.color}`}>
      <Icon className="w-3.5 h-3.5 mr-1" />
      {conf.label}
    </span>
  );
}

function BooleanBadge({ value }: { value: boolean }) {
  if (value) {
    return (
      <span className="inline-flex items-center rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
        <Check className="w-3.5 h-3.5 mr-1" />
        Sí
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-600/20">
      <XCircle className="w-3.5 h-3.5 mr-1 text-slate-400" />
      No
    </span>
  );
}

export function AdminUserDetailPage({ userId }: { userId: number }) {
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingDocumentId, setReviewingDocumentId] = useState<number | null>(null);
  const [error, setError] = useState('');
  
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    documentId: number | null;
    decision: ReviewDecision | null;
  }>({ isOpen: false, documentId: null, decision: null });
  const [reviewReason, setReviewReason] = useState('');

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function loadUser() {
    setIsLoading(true);
    setError('');
    try {
      setUser(await adminUsersApi.getAdminUserDetail(userId));
    } catch (caughtError) {
      setError(resolveErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  }

  function handleReviewClick(documentId: number, decision: ReviewDecision) {
    setReviewModal({ isOpen: true, documentId, decision });
    setReviewReason('');
  }

  async function submitReview() {
    const { documentId, decision } = reviewModal;
    if (!documentId || !decision) return;

    setReviewingDocumentId(documentId);
    setReviewModal({ isOpen: false, documentId: null, decision: null });
    
    try {
      await verificationApi.reviewVerificationDocument(documentId, {
        decision,
        reason: reviewReason.trim() || undefined,
      });
      toast.success(`Documento ${decision === 'APPROVED' ? 'aprobado' : 'rechazado'} correctamente`);
      await loadUser();
    } catch (caughtError) {
      toast.error(resolveErrorMessage(caughtError));
    } finally {
      setReviewingDocumentId(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto space-y-8 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <button
            type="button"
            className="inline-flex items-center text-sm font-semibold text-slate-500 transition hover:text-slate-800"
            onClick={() => navigate(routes.adminUsers)}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Volver a usuarios
          </button>
        </div>

        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
        {isLoading && <p className="text-sm leading-6 text-slate-600">Cargando detalle...</p>}

        {!isLoading && user && (
          <>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <UserCircle className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-green-800">Usuario</p>
                  <h1 className="mt-1 font-display text-2xl font-bold text-green-950">{user.fullName}</h1>
                </div>
              </div>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-slate-500">Email</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-slate-900">{user.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-slate-500">Teléfono</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-slate-900">{user.phone}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-slate-500">Estado</dt>
                  <dd className="mt-1.5"><StatusBadge status={user.status} /></dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-slate-500">Roles</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-2">
                    {user.roles.map(role => (
                      <span key={role} className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20"><RoleIcon role={role} className="w-3 h-3 mr-1" />{role}</span>
                    ))}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-slate-500">Email verificado</dt>
                  <dd className="mt-1.5"><BooleanBadge value={user.emailVerified} /></dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-slate-500">Teléfono verificado</dt>
                  <dd className="mt-1.5"><BooleanBadge value={user.phoneVerified} /></dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Briefcase className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-blue-800">Perfil</p>
                  <h2 className="mt-1 font-display text-xl font-bold text-slate-900">Datos por rol</h2>
                </div>
              </div>
              {user.profile && Object.keys(user.profile).length > 0 ? (
                <>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                    {Object.entries(user.profile).map(([key, value]) => (
                      <div className="sm:col-span-1 rounded-xl border border-slate-100 bg-slate-50 p-4" key={key}>
                        <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          {profileKeyLabels[key] || key}
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-900">
                          {formatProfileValue(value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  
                  {user.profile.geoLatitude && user.profile.geoLongitude && (
                    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 relative z-0">
                      <LocationMap 
                        latitude={user.profile.geoLatitude as number} 
                        longitude={user.profile.geoLongitude as number} 
                        readOnly={true} 
                      />
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm leading-6 text-slate-600">El usuario no tiene perfil específico disponible.</p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <FileText className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-purple-800">Verificación</p>
                  <h2 className="mt-1 font-display text-xl font-bold text-slate-900">Documentos</h2>
                </div>
              </div>
              
              <div className="mb-8">
                <DocumentList 
                  documents={user.verificationDocuments} 
                  documentTypes={getRequiredDocuments(user.roles)}
                  onOpenModal={() => {}} 
                  readOnly={true}
                  onReview={handleReviewClick}
                  reviewingDocumentId={reviewingDocumentId}
                />
              </div>
            </div>

            <Dialog 
              open={reviewModal.isOpen} 
              onOpenChange={(open) => !open && setReviewModal((prev) => ({ ...prev, isOpen: false }))}
            >
              <DialogContent className="bg-white rounded-2xl w-full max-w-lg overflow-hidden p-0 border-0 shadow-2xl">
                <DialogHeader className={`flex flex-row items-center justify-between px-6 py-4 border-b m-0 space-y-0 ${
                  reviewModal.decision === 'APPROVED' 
                    ? 'border-green-100 bg-gradient-to-br from-green-50 to-green-100' 
                    : 'border-red-100 bg-gradient-to-br from-red-50 to-red-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      reviewModal.decision === 'APPROVED'
                        ? 'bg-gradient-to-br from-green-800 to-green-500'
                        : 'bg-gradient-to-br from-red-800 to-red-500'
                    }`}>
                      {reviewModal.decision === 'APPROVED' ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <XCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex flex-col text-left">
                      <DialogTitle className="text-slate-900 text-base m-0 font-bold">
                        {reviewModal.decision === 'APPROVED' ? 'Aprobar documento' : 'Rechazar documento'}
                      </DialogTitle>
                      <p className="text-slate-500 text-xs m-0">
                        {reviewModal.decision === 'APPROVED' 
                          ? 'Opcionalmente puede dejar un comentario' 
                          : 'Debe especificar el motivo del rechazo'}
                      </p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5 font-semibold">Motivo</label>
                    <Input
                      type="text"
                      placeholder={reviewModal.decision === 'APPROVED' ? 'Ej. Todo en orden...' : 'Ej. Faltan firmas...'}
                      value={reviewReason}
                      onChange={(e) => setReviewReason(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:border-transparent"
                    />

                    <div className="mt-3 flex flex-wrap gap-2">
                      {(reviewModal.decision === 'APPROVED'
                        ? ['Todo en orden', 'Documento válido', 'Información correcta']
                        : ['Falta firma', 'Documento ilegible', 'Documento expirado', 'Datos no coinciden']
                      ).map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => setReviewReason(suggestion)}
                          className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-6 pb-6">
                  <Button 
                    onClick={() => setReviewModal((prev) => ({ ...prev, isOpen: false }))} 
                    variant="outline" 
                    className="flex-1 py-3 font-medium rounded-xl border-slate-200 text-slate-700 text-sm transition-all hover:bg-slate-50 h-auto"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={submitReview} 
                    disabled={reviewModal.decision === 'REJECTED' && !reviewReason.trim()}
                    className={`flex-1 flex font-semibold items-center justify-center gap-2 py-3 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95 h-auto disabled:opacity-50 disabled:cursor-not-allowed ${
                      reviewModal.decision === 'APPROVED'
                        ? 'bg-gradient-to-br from-green-800 to-green-500 shadow-lg shadow-green-800/30'
                        : 'bg-gradient-to-br from-red-800 to-red-500 shadow-lg shadow-red-800/30'
                    }`}
                  >
                    Confirmar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </section>
    </main>
  );
}
