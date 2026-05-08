import { useEffect, useState } from 'react';
import { navigate } from '../../../app/router';
import { routes } from '../../../config/routes';
import { useAuth } from '../../../hooks/useAuth';
import { ProducerLocationMap } from '../components/ProducerLocationMap';
import * as producerApi from '../api/producerApi';
import type { ProducerProfile } from '../types/producerTypes';
import { VerificationDocumentsPanel } from '../../verification/components/VerificationDocumentsPanel';
import { resolveErrorMessage } from '../../../utils/errorUtils';
import { formatProducerType, formatRole } from '../../../utils/formatters';
import { ROLES } from '../../../config/roles';

export function ProducerProfilePage() {
  const { user, logout } = useAuth();
  const isProducer = user?.roles.includes(ROLES.PRODUCER) ?? false;
  const isAdmin = user?.roles.includes(ROLES.ADMIN) ?? false;
  const [producerProfile, setProducerProfile] = useState<ProducerProfile | null>(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(isProducer);
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [error, setError] = useState('');

  const initials = user?.fullName
    ? user.fullName.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : 'US';

  useEffect(() => {
    if (!isProducer) {
      return;
    }

    let active = true;
    setIsLoadingProfile(true);
    setError('');

    producerApi
      .getCurrentProducerProfile()
      .then((profile) => {
        if (!active) {
          return;
        }
        setProducerProfile(profile);
        setLatitude(profile.geoLatitude?.toString() ?? '');
        setLongitude(profile.geoLongitude?.toString() ?? '');
        setIsEditingLocation(!profile.geolocationCompleted);
      })
      .catch((caughtError) => {
        if (active) {
          setError(resolveErrorMessage(caughtError));
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingProfile(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isProducer]);

  async function handleLogout() {
    await logout();
    navigate(routes.login);
  }

  async function handleSaveLocation() {
    setError('');

    if (!latitude || !longitude) {
      setError('Debe marcar una ubicacion en el mapa antes de guardar.');
      return;
    }

    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);
    if (!Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude)) {
      setError('Las coordenadas seleccionadas no son validas.');
      return;
    }

    setIsSavingLocation(true);
    try {
      const updatedProfile = await producerApi.updateCurrentProducerLocation({
        geoLatitude: parsedLatitude,
        geoLongitude: parsedLongitude,
      });
      setProducerProfile(updatedProfile);
      setLatitude(updatedProfile.geoLatitude?.toString() ?? '');
      setLongitude(updatedProfile.geoLongitude?.toString() ?? '');
      setIsEditingLocation(false);
    } catch (caughtError) {
      setError(resolveErrorMessage(caughtError));
    } finally {
      setIsSavingLocation(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto space-y-8 px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 border-b border-slate-100 pb-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-900 text-xl font-bold text-white shadow-sm">
              {initials}
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-green-800">Cuenta</p>
              <h1 className="mt-1 font-display text-2xl font-bold text-green-950">{user?.fullName}</h1>
              <p className="mt-1 text-sm font-medium text-slate-500">{user?.email}</p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-slate-500">Teléfono</dt>
              <dd className="mt-1.5 text-sm font-semibold text-slate-900">{user?.phone || 'No especificado'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-slate-500">Estado</dt>
              <dd className="mt-1.5 text-sm font-semibold text-slate-900">{user?.status}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-slate-500">Roles asignados</dt>
              <dd className="mt-1.5 flex flex-wrap gap-2">
                {user?.roles.map(role => (
                  <span key={role} className="inline-flex items-center rounded-md bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-600/20">{formatRole(role)}</span>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        {!isAdmin &&  <VerificationDocumentsPanel />}

        {isProducer && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-wide text-green-800">Productor</p>
              <h2 className="mt-2 font-display text-xl font-bold text-green-950">Predio y geolocalizacion</h2>
            </div>

            {isLoadingProfile && <p className="text-sm leading-6 text-slate-600">Cargando perfil de productor...</p>}

            {!isLoadingProfile && producerProfile && (
              <>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-slate-500">Finca</dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900">{producerProfile.farmName}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-slate-500">Tipo productor</dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900">{formatProducerType(producerProfile.producerType)}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-slate-500">Municipio</dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900">{producerProfile.municipality}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-slate-500">Provincia</dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900">{producerProfile.province}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-slate-500">Departamento</dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900">{producerProfile.department}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-slate-500">Experiencia</dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900">{producerProfile.experienceYears} anios</dd>
                  </div>
                </dl>

                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                  <span className={producerProfile.geolocationCompleted ? 'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20' : 'inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20'}>
                    {producerProfile.geolocationCompleted
                      ? 'Ubicacion GPS registrada'
                      : 'Ubicacion GPS pendiente'}
                  </span>
                  {!isEditingLocation && (
                    <button
                      type="button"
                      className="text-sm font-semibold text-green-700 transition hover:text-green-900"
                      onClick={() => setIsEditingLocation(true)}
                    >
                      {producerProfile.geolocationCompleted ? 'Editar ubicacion' : 'Registrar ubicacion'}
                    </button>
                  )}
                </div>

                {producerProfile.geolocationCompleted && !isEditingLocation && (
                  <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-slate-500">Latitud</dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-900">{producerProfile.geoLatitude}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-slate-500">Longitud</dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-900">{producerProfile.geoLongitude}</dd>
                    </div>
                  </dl>
                )}

                {isEditingLocation && (
                  <div className="mt-6 space-y-6">
                    <div className="overflow-hidden rounded-xl border border-slate-200">
                      <ProducerLocationMap
                        latitude={latitude}
                        longitude={longitude}
                        onChange={(nextLatitude, nextLongitude) => {
                          setLatitude(nextLatitude);
                          setLongitude(nextLongitude);
                        }}
                      />
                    </div>

                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-slate-500">Latitud seleccionada</dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-900">{latitude || 'Sin seleccionar'}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-slate-500">Longitud seleccionada</dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-900">{longitude || 'Sin seleccionar'}</dd>
                      </div>
                    </dl>

                    <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                      {producerProfile.geolocationCompleted && (
                        <button
                          type="button"
                          className="px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900 disabled:opacity-70"
                          disabled={isSavingLocation}
                          onClick={() => {
                            setLatitude(producerProfile.geoLatitude?.toString() ?? '');
                            setLongitude(producerProfile.geoLongitude?.toString() ?? '');
                            setIsEditingLocation(false);
                            setError('');
                          }}
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        type="button"
                        className="flex items-center justify-center rounded-lg bg-green-800 px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-green-900/20 transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={isSavingLocation}
                        onClick={handleSaveLocation}
                      >
                        {isSavingLocation ? 'Guardando...' : 'Guardar ubicacion'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {!isProducer && !isAdmin && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-wide text-green-800">Perfil</p>
              <h2 className="mt-2 font-display text-xl font-bold text-green-950">Informacion por rol</h2>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              La informacion especifica de este rol se mostrara cuando el backend exponga su
              endpoint de perfil.
            </p>
          </div>
        )}

        {isAdmin && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-wide text-green-800">Administracion</p>
              <h2 className="mt-2 font-display text-xl font-bold text-green-950">Gestion operativa</h2>
            </div>
            <p className="text-sm leading-6 text-slate-600">Use el panel de gestion de usuarios para revisar estados y documentos.</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">
            {error}
          </div>
        )}
      </section>
    </main>
  );
}
