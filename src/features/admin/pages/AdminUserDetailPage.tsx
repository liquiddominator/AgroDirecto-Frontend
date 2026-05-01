import { useEffect, useState } from 'react';
import { navigate } from '../../../app/router';
import { routes } from '../../../config/routes';
import { isApiError } from '../../../lib/api/apiError';
import * as adminUsersApi from '../api/adminUsersApi';
import type { AdminUserDetail } from '../types/adminTypes';
import { DocumentList } from '../../verification/components/VerificationDocumentsPanel';
import * as verificationApi from '../../verification/api/verificationApi';
import type { ReviewDecision } from '../../verification/types/verificationTypes';

export function AdminUserDetailPage({ userId }: { userId: number }) {
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingDocumentId, setReviewingDocumentId] = useState<number | null>(null);
  const [error, setError] = useState('');

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

  async function handleReview(documentId: number, decision: ReviewDecision) {
    const reason = window.prompt(
      decision === 'APPROVED' ? 'Motivo de aprobacion' : 'Motivo de rechazo',
      '',
    );
    if (decision === 'REJECTED' && !reason?.trim()) {
      setError('El motivo es obligatorio para rechazar un documento.');
      return;
    }

    setReviewingDocumentId(documentId);
    setError('');
    try {
      await verificationApi.reviewVerificationDocument(documentId, {
        decision,
        reason: reason?.trim() || undefined,
      });
      await loadUser();
    } catch (caughtError) {
      setError(resolveErrorMessage(caughtError));
    } finally {
      setReviewingDocumentId(null);
    }
  }

  return (
    <main className="profile-view">
      <header className="topbar">
        <div>
          <strong>AgroDirecto</strong>
          <span>Detalle de usuario</span>
        </div>
        <nav className="topbar-actions" aria-label="Navegacion admin detalle">
          <button type="button" className="ghost-button" onClick={() => navigate(routes.adminUsers)}>
            Usuarios
          </button>
          <button type="button" className="ghost-button" onClick={() => navigate(routes.dashboard)}>
            Panel
          </button>
        </nav>
      </header>

      <section className="profile-content">
        {error && <p className="form-error">{error}</p>}
        {isLoading && <p className="muted-text">Cargando detalle...</p>}

        {!isLoading && user && (
          <>
            <div className="profile-card">
              <div className="section-heading">
                <p>Usuario</p>
                <h1>{user.fullName}</h1>
              </div>
              <dl className="profile-list">
                <div>
                  <dt>Email</dt>
                  <dd>{user.email}</dd>
                </div>
                <div>
                  <dt>Telefono</dt>
                  <dd>{user.phone}</dd>
                </div>
                <div>
                  <dt>Estado</dt>
                  <dd>{user.status}</dd>
                </div>
                <div>
                  <dt>Roles</dt>
                  <dd>{user.roles.join(', ')}</dd>
                </div>
                <div>
                  <dt>Email verificado</dt>
                  <dd>{user.emailVerified ? 'Si' : 'No'}</dd>
                </div>
                <div>
                  <dt>Telefono verificado</dt>
                  <dd>{user.phoneVerified ? 'Si' : 'No'}</dd>
                </div>
              </dl>
            </div>

            <div className="profile-card">
              <div className="section-heading">
                <p>Perfil</p>
                <h2>Datos por rol</h2>
              </div>
              {user.profile ? (
                <pre className="profile-json">{JSON.stringify(user.profile, null, 2)}</pre>
              ) : (
                <p className="muted-text">El usuario no tiene perfil especifico disponible.</p>
              )}
            </div>

            <div className="profile-card">
              <div className="section-heading">
                <p>Verificacion</p>
                <h2>Documentos</h2>
              </div>
              <DocumentList documents={user.verificationDocuments} />

              {user.verificationDocuments.length > 0 && (
                <div className="review-actions-list">
                  {user.verificationDocuments.map((document) => (
                    <div className="review-row" key={document.id}>
                      <span>{document.documentTypeName}</span>
                      <div className="topbar-actions">
                        <button
                          type="button"
                          className="primary-button"
                          disabled={reviewingDocumentId === document.id}
                          onClick={() => handleReview(document.id, 'APPROVED')}
                        >
                          Aprobar
                        </button>
                        <button
                          type="button"
                          className="ghost-button"
                          disabled={reviewingDocumentId === document.id}
                          onClick={() => handleReview(document.id, 'REJECTED')}
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function resolveErrorMessage(error: unknown) {
  if (isApiError(error)) {
    const detailMessages = Object.values(error.details);
    return detailMessages.length > 0 ? detailMessages.join(' ') : error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'No se pudo completar la operacion.';
}
