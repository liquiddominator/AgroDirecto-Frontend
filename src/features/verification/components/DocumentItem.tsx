import {
  FileCheck,
  AlertCircle,
  XCircle,
  CheckCircle,
  Eye,
  RefreshCw,
  Upload,
  Clock,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { VerificationDocument } from "../types/verificationTypes";
import * as verificationApi from "../api/verificationApi";

interface DocumentItemProps {
  document: VerificationDocument;
  onOpenModal: () => void;
  readOnly?: boolean;
  onReview?: (decision: "APPROVED" | "REJECTED") => void;
  isReviewing?: boolean;
}

const statusConfig = {
  aprobado: {
    label: "Aprobado",
    icon: CheckCircle,
    bgClass: "bg-green-100",
    textClass: "text-green-900",
  },
  rechazado: {
    label: "Rechazado",
    icon: XCircle,
    bgClass: "bg-red-100",
    textClass: "text-red-900",
  },
  en_revision: {
    label: "En revisión",
    icon: Clock,
    bgClass: "bg-blue-100",
    textClass: "text-blue-900",
  },
  pendiente: {
    label: "Pendiente",
    icon: AlertCircle,
    bgClass: "bg-yellow-100",
    textClass: "text-yellow-900",
  },
} as const;

export function DocumentItem({ document: doc, onOpenModal, readOnly, onReview, isReviewing }: DocumentItemProps) {
  const isUploaded = !!doc.originalFilename;
  const isApproved = doc.latestReview?.decision === "APPROVED";
  const isRejected = doc.latestReview && doc.latestReview.decision !== "APPROVED";

  const statusKey = !isUploaded ? "pendiente" : isApproved ? "aprobado" : isRejected ? "rechazado" : "en_revision";
  const cfg = statusConfig[statusKey];
  const StatusIcon = cfg.icon;
  const DocIcon = FileText;

  const uploadDate = doc.uploadedAt
    ? new Intl.DateTimeFormat("es-BO", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(doc.uploadedAt))
    : null;

  return (
    <Card
      className={`shadow-sm transition-all ${statusKey === "rechazado" ? "border-l-4 border-l-red-500" : "border-l border-l-slate-200"}`}
    >
      <CardContent className="p-5 flex items-start gap-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cfg.bgClass}`}
        >
          <DocIcon className={`w-5 h-5 ${cfg.textClass}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start flex-wrap gap-2 justify-between">
            <div>
              <p className="text-slate-900 text-sm font-semibold">
                {doc.documentTypeName}
              </p>
              {doc.documentNumber && (
                <p className="text-gray-500 text-xs mt-0.5">N° {doc.documentNumber}</p>
              )}
            </div>
            <Badge 
              variant="secondary"
              className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full shrink-0 border-none font-semibold ${cfg.bgClass} ${cfg.textClass}`}
            >
              <StatusIcon className="w-3 h-3" />
              {cfg.label}
            </Badge>
          </div>

          {doc.originalFilename ? (
            <div className="flex items-center gap-1.5 mt-2">
              <FileCheck className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs text-gray-600 font-mono truncate max-w-[150px]">
                {doc.originalFilename}
              </span>
              <span className="text-gray-300 text-xs">•</span>
              <span className="text-xs text-gray-400">
                Subido el {uploadDate}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 mt-2">
              <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400">Sin archivo cargado</span>
            </div>
          )}

          {statusKey === "rechazado" && doc.latestReview?.reason && (
            <div
              className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-red-50"
            >
              <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <div>
                <p className="text-xs font-semibold text-red-800">
                  Motivo del rechazo
                </p>
                <p className="text-xs mt-0.5 text-red-700 leading-relaxed">
                  {doc.latestReview.reason}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {!readOnly && statusKey === "pendiente" && (
              <Button
                type="button"
                onClick={onOpenModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-all hover:opacity-90 h-auto bg-gradient-to-br from-green-800 to-green-600"
              >
                <Upload className="w-3.5 h-3.5" />
                Subir archivo
              </Button>
            )}
            
            {statusKey !== "pendiente" && (
              <>
                <Button variant="outline" asChild className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-gray-200 text-gray-600 text-xs transition-all hover:bg-gray-50 h-auto">
                  <a href={verificationApi.documentFileUrl(doc.downloadUrl)} target="_blank" rel="noreferrer">
                    <Eye className="w-3.5 h-3.5" /> Ver documento
                  </a>
                </Button>
                {!readOnly && (
                  <Button type="button" variant="outline" onClick={onOpenModal} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-gray-200 text-gray-600 text-xs transition-all hover:bg-gray-50 h-auto">
                    <RefreshCw className="w-3.5 h-3.5" /> Reemplazar
                  </Button>
                )}

                {onReview && isUploaded && (
                  <div className="ml-auto flex items-center gap-2 pl-4">
                    <Button
                      type="button"
                      onClick={() => onReview("APPROVED")}
                      disabled={isReviewing || statusKey === "aprobado"}
                      className="h-auto px-3 py-1.5 text-xs font-semibold bg-green-800 hover:bg-green-900 text-white"
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Aprobar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onReview("REJECTED")}
                      disabled={isReviewing || statusKey === "rechazado"}
                      className="h-auto px-3 py-1.5 text-xs font-semibold border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Rechazar
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
