import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { isApiError } from '../../../lib/api/apiError';
import * as verificationApi from '../api/verificationApi';
import type { VerificationDocument } from '../types/verificationTypes';

const documentTypes = [
  { code: 'CI', label: 'Carnet de Identidad' },
  { code: 'PRODUCER_REGISTRY', label: 'Registro de Productor' },
  { code: 'COMMUNITY_CERTIFICATE', label: 'Certificado Comunitario' },
  { code: 'DRIVER_LICENSE', label: 'Licencia de Conducir' },
  { code: 'SOAT', label: 'SOAT' },
  { code: 'VEHICLE_REGISTRY', label: 'Registro de Vehiculo' },
];

export function VerificationDocumentsPanel() {
  const { user, refreshUser } = useAuth();
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [documentTypeCode, setDocumentTypeCode] = useState('CI');
  const [documentNumber, setDocumentNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isVerified = user?.status === 'VERIFIED';
  const canUpload = user?.status !== 'VERIFIED';

  useEffect(() => {
    let active = true;
    verificationApi
      .listMyVerificationDocuments()
      .then((response) => {
        if (active) {
          setDocuments(response);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setError('');

    if (!file) {
      setError('Debe seleccionar un archivo PDF, JPG o PNG.');
      return;
    }

    setIsSubmitting(true);
    try {
      const uploaded = await verificationApi.uploadVerificationDocument({
        documentTypeCode,
        documentNumber,
        file,
      });
      setDocuments((current) => [uploaded, ...current]);
      setDocumentNumber('');
      setFile(null);
      await refreshUser();
      formElement.reset();
    } catch (caughtError) {
      setError(resolveErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="profile-card">
      <div className="section-heading">
        <p>Verificacion</p>
        <h2>Documentos y estado</h2>
      </div>

      <div className="verification-banner">
        <span className={isVerified ? 'status-ok' : 'status-pending'}>
          {isVerified ? 'Usuario verificado' : 'Modo solo lectura hasta completar verificacion'}
        </span>
      </div>

      {canUpload && (
        <form className="document-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Tipo de documento
              <select
                value={documentTypeCode}
                onChange={(event) => setDocumentTypeCode(event.target.value)}
              >
                {documentTypes.map((type) => (
                  <option key={type.code} value={type.code}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Numero de documento
              <input
                value={documentNumber}
                maxLength={80}
                onChange={(event) => setDocumentNumber(event.target.value)}
              />
            </label>
          </div>

          <label>
            Archivo
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Subiendo...' : 'Subir documento'}
            </button>
          </div>
        </form>
      )}

      {error && <p className="form-error">{error}</p>}

      {isLoading ? (
        <p className="muted-text">Cargando documentos...</p>
      ) : (
        <DocumentList documents={documents} />
      )}
    </div>
  );
}

export function DocumentList({ documents }: { documents: VerificationDocument[] }) {
  if (documents.length === 0) {
    return <p className="muted-text">No hay documentos cargados.</p>;
  }

  return (
    <div className="document-list">
      {documents.map((document) => (
        <article className="document-card" key={document.id}>
          <div>
            <strong>{document.documentTypeName}</strong>
            <span>{document.originalFilename ?? 'Archivo sin nombre'}</span>
          </div>
          <dl className="compact-list">
            <div>
              <dt>Numero</dt>
              <dd>{document.documentNumber ?? 'No registrado'}</dd>
            </div>
            <div>
              <dt>Subido</dt>
              <dd>{formatDate(document.uploadedAt)}</dd>
            </div>
            <div>
              <dt>Revision</dt>
              <dd>{document.latestReview ? formatDecision(document.latestReview.decision) : 'Pendiente'}</dd>
            </div>
          </dl>
          {document.latestReview?.reason && <p className="muted-text">{document.latestReview.reason}</p>}
          <a
            className="inline-link"
            href={verificationApi.documentFileUrl(document.downloadUrl)}
            target="_blank"
            rel="noreferrer"
          >
            Ver documento
          </a>
        </article>
      ))}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-BO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatDecision(value: string) {
  return value === 'APPROVED' ? 'Aprobado' : 'Rechazado';
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
