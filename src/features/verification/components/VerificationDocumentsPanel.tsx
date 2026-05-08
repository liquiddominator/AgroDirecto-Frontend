import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { isApiError } from '../../../lib/api/apiError';
import * as verificationApi from '../api/verificationApi';
import type { VerificationDocument } from '../types/verificationTypes';
import { UserStatusCard } from './UserStatusCard';
import { DocumentItem } from './DocumentItem';
import { SummaryPanel } from './SummaryPanel';
import { UploadModal } from './UploadModal';
import { ROLES } from '../../../config/roles';

export const ALL_DOCUMENT_TYPES = {
  CI: { code: 'CI', label: 'Carnet de Identidad' },
  PRODUCER_REGISTRY: { code: 'PRODUCER_REGISTRY', label: 'Registro de Productor' },
  COMMUNITY_CERTIFICATE: { code: 'COMMUNITY_CERTIFICATE', label: 'Certificado Comunitario' },
  DRIVER_LICENSE: { code: 'DRIVER_LICENSE', label: 'Licencia de Conducir' },
  SOAT: { code: 'SOAT', label: 'SOAT' },
  VEHICLE_REGISTRY: { code: 'VEHICLE_REGISTRY', label: 'Registro de Vehículo' },
};

export function getRequiredDocuments(roles: string[] = []) {
  const docs = [ALL_DOCUMENT_TYPES.CI]; 

  if (roles.includes(ROLES.PRODUCER)) {
    docs.push(ALL_DOCUMENT_TYPES.PRODUCER_REGISTRY, ALL_DOCUMENT_TYPES.COMMUNITY_CERTIFICATE);
  }
  
  if (roles.includes(ROLES.CARRIER)) {
    docs.push(ALL_DOCUMENT_TYPES.DRIVER_LICENSE, ALL_DOCUMENT_TYPES.SOAT, ALL_DOCUMENT_TYPES.VEHICLE_REGISTRY);
  }

  return docs;
}

export function VerificationDocumentsPanel() {
  const { user, refreshUser } = useAuth();
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [documentTypeCode, setDocumentTypeCode] = useState('CI');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  const documentTypes = getRequiredDocuments(user?.roles);

  const isVerified = user?.status === 'VERIFIED';
  const canUpload = user?.status !== 'VERIFIED';

  const loadedCount = documents.length;
  const approvedCount = documents.filter((d) => d.latestReview?.decision === 'APPROVED').length;
  const rejectedCount = documents.filter((d) => d.latestReview && d.latestReview.decision !== 'APPROVED').length;
  const pendingCount = documents.filter((d) => !d.latestReview).length;

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

  async function handleUpload(typeCode: string, docNumber: string, uploadFile: File) {
    setError('');
    try {
      const uploaded = await verificationApi.uploadVerificationDocument({
        documentTypeCode: typeCode,
        documentNumber: docNumber,
        file: uploadFile,
      });
      setDocuments((current) => [uploaded, ...current]);
      await refreshUser();
    } catch (caughtError) {
      setError(resolveErrorMessage(caughtError));
      throw caughtError;
    }
  }

  function handleOpenModal(typeCode?: string) {
    setDocumentTypeCode(typeCode || 'CI');
    setIsFormVisible(true);
  }

  return (
    
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
      
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
                    <h3 className="text-gray-900 text-base" style={{ fontWeight: 700 }}>
                Documentos requeridos
              </h3>
        <div className="mb-6">
          <UserStatusCard
            loaded={loadedCount}
            totalDocuments={documentTypes.length}
            isVerified={isVerified}
          />
        </div>

      <UploadModal
        isOpen={canUpload && isFormVisible}
        onClose={() => setIsFormVisible(false)}
        onSubmit={handleUpload}
        initialDocType={documentTypeCode}
        documentTypes={documentTypes}
      />

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando documentos...</p>
      ) : (
        <DocumentList 
          documents={documents} 
          documentTypes={documentTypes} 
          onOpenModal={handleOpenModal} 
          readOnly={!canUpload} 
        />
      )}
      </div>

      <div className="lg:col-span-1">
        <SummaryPanel
          loaded={loadedCount}
          pending={pendingCount}
          approved={approvedCount}
          rejected={rejectedCount}
          totalDocuments={documentTypes.length}
          documentTypes={documentTypes.map((t) => t.label)}
        />
      </div>
    </div>
  );
}

export function DocumentList({ 
  documents, 
  documentTypes, 
  onOpenModal, 
  readOnly,
  onReview,
  reviewingDocumentId 
}: { documents: VerificationDocument[]; documentTypes: {code: string, label: string}[]; onOpenModal: (typeCode: string) => void; readOnly?: boolean; onReview?: (documentId: number, decision: "APPROVED" | "REJECTED") => void; reviewingDocumentId?: number | null }) {
  const allDocs = documentTypes.map(type => {
    const uploaded = documents.find(d => d.documentTypeCode === type.code);
    if (uploaded) return uploaded;
    
    return {
      id: `pending-${type.code}`,
      documentTypeCode: type.code,
      documentTypeName: type.label,
      downloadUrl: '',
      uploadedAt: ''
    } as unknown as VerificationDocument;
  });

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {allDocs.map((document) => (
        <DocumentItem 
          key={document.id} 
          document={document} 
          onOpenModal={() => onOpenModal(document.documentTypeCode)} 
          readOnly={readOnly}
          onReview={onReview && typeof document.id === 'number' ? (decision) => onReview(document.id as number, decision) : undefined}
          isReviewing={reviewingDocumentId === document.id}
        />
      ))}
    </div>
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
