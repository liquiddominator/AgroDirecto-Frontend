import { useEffect, useState } from 'react';
import { navigate } from '../../../app/router';
import { routes } from '../../../config/routes';
import { useAuth } from '../../../hooks/useAuth';
import { isApiError } from '../../../lib/api/apiError';
import { ProducerLocationMap } from '../components/ProducerLocationMap';
import * as producerApi from '../api/producerApi';
import type { ProducerProfile } from '../types/producerTypes';
import { VerificationDocumentsPanel } from '../../verification/components/VerificationDocumentsPanel';

export function ProducerProfilePage() {
  const { user, logout } = useAuth();
  const isProducer = user?.roles.includes('PRODUCER') ?? false;
  const isAdmin = user?.roles.includes('ADMIN') ?? false;
  const [producerProfile, setProducerProfile] = useState<ProducerProfile | null>(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(isProducer);
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [error, setError] = useState('');

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
    <main className="profile-view">
      <header className="topbar">
        <div>
          <strong>AgroDirecto</strong>
          <span>Mi perfil</span>
        </div>
        <nav className="topbar-actions" aria-label="Navegacion de perfil">
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
            <p>Cuenta</p>
            <h1>{user?.fullName}</h1>
          </div>

          <dl className="profile-list">
            <div>
              <dt>Email</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>{user?.status}</dd>
            </div>
            <div>
              <dt>Rol principal</dt>
              <dd>{formatRole(user?.primaryRole)}</dd>
            </div>
            <div>
              <dt>Roles</dt>
              <dd>{user?.roles.map(formatRole).join(', ')}</dd>
            </div>
          </dl>
        </div>

        {!isAdmin && <VerificationDocumentsPanel />}

        {isProducer && (
          <div className="profile-card producer-card">
            <div className="section-heading">
              <p>Productor</p>
              <h2>Predio y geolocalizacion</h2>
            </div>

            {isLoadingProfile && <p className="muted-text">Cargando perfil de productor...</p>}

            {!isLoadingProfile && producerProfile && (
              <>
                <dl className="profile-list producer-details">
                  <div>
                    <dt>Finca</dt>
                    <dd>{producerProfile.farmName}</dd>
                  </div>
                  <div>
                    <dt>Tipo productor</dt>
                    <dd>{formatProducerType(producerProfile.producerType)}</dd>
                  </div>
                  <div>
                    <dt>Municipio</dt>
                    <dd>{producerProfile.municipality}</dd>
                  </div>
                  <div>
                    <dt>Provincia</dt>
                    <dd>{producerProfile.province}</dd>
                  </div>
                  <div>
                    <dt>Departamento</dt>
                    <dd>{producerProfile.department}</dd>
                  </div>
                  <div>
                    <dt>Experiencia</dt>
                    <dd>{producerProfile.experienceYears} anios</dd>
                  </div>
                </dl>

                <div className="location-status">
                  <span className={producerProfile.geolocationCompleted ? 'status-ok' : 'status-pending'}>
                    {producerProfile.geolocationCompleted
                      ? 'Ubicacion GPS registrada'
                      : 'Ubicacion GPS pendiente'}
                  </span>
                  {!isEditingLocation && (
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => setIsEditingLocation(true)}
                    >
                      {producerProfile.geolocationCompleted ? 'Editar ubicacion' : 'Registrar ubicacion'}
                    </button>
                  )}
                </div>

                {producerProfile.geolocationCompleted && !isEditingLocation && (
                  <dl className="coordinate-list">
                    <div>
                      <dt>Latitud</dt>
                      <dd>{producerProfile.geoLatitude}</dd>
                    </div>
                    <div>
                      <dt>Longitud</dt>
                      <dd>{producerProfile.geoLongitude}</dd>
                    </div>
                  </dl>
                )}

                {isEditingLocation && (
                  <div className="location-editor">
                    <ProducerLocationMap
                      latitude={latitude}
                      longitude={longitude}
                      onChange={(nextLatitude, nextLongitude) => {
                        setLatitude(nextLatitude);
                        setLongitude(nextLongitude);
                      }}
                    />

                    <dl className="coordinate-list">
                      <div>
                        <dt>Latitud seleccionada</dt>
                        <dd>{latitude || 'Sin seleccionar'}</dd>
                      </div>
                      <div>
                        <dt>Longitud seleccionada</dt>
                        <dd>{longitude || 'Sin seleccionar'}</dd>
                      </div>
                    </dl>

                    <div className="form-actions">
                      {producerProfile.geolocationCompleted && (
                        <button
                          type="button"
                          className="ghost-button"
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
                        className="primary-button"
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
          <div className="profile-card">
            <div className="section-heading">
              <p>Perfil</p>
              <h2>Informacion por rol</h2>
            </div>
            <p className="muted-text">
              La informacion especifica de este rol se mostrara cuando el backend exponga su
              endpoint de perfil.
            </p>
          </div>
        )}

        {isAdmin && (
          <div className="profile-card">
            <div className="section-heading">
              <p>Administracion</p>
              <h2>Gestion operativa</h2>
            </div>
            <p className="muted-text">Use el panel de gestion de usuarios para revisar estados y documentos.</p>
          </div>
        )}

        {error && <p className="form-error">{error}</p>}
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

  return 'No se pudo completar la operacion.';
}

function formatRole(role: string | null | undefined) {
  if (!role) {
    return 'Sin rol';
  }

  const labels: Record<string, string> = {
    PRODUCER: 'Productor',
    BUYER: 'Comprador',
    CARRIER: 'Transportista',
    ADMIN: 'Administrador',
  };
  return labels[role] ?? role;
}

function formatProducerType(type: string) {
  const labels: Record<string, string> = {
    INDIVIDUAL: 'Individual',
    ASSOCIATION: 'Asociacion',
    COOPERATIVE: 'Cooperativa',
  };
  return labels[type] ?? type;
}
