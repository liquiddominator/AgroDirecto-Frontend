import { AlertCircle, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserStatusCardProps {
  loaded: number;
  totalDocuments: number;
  isVerified: boolean;
}

export function UserStatusCard({ loaded, totalDocuments, isVerified }: UserStatusCardProps) {
  return (
    <Card
      className="bg-white rounded-2xl border-slate-200 shadow-sm"
    >
      <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
          >
            {isVerified ? <ShieldCheck className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-1 flex-wrap">
              <h2 className="text-slate-900 text-lg font-bold">
                Estado de verificación
              </h2>
              <Badge variant="secondary"
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border-none ${isVerified ? 'bg-green-100 text-green-900' : 'bg-yellow-100 text-yellow-900'}`}
              >
                {!isVerified && <AlertCircle className="w-3 h-3" />}
                {isVerified ? "Verificado" : "Pendiente"}
              </Badge>
            </div>
            <p className="text-slate-500 text-sm">
              {isVerified 
                ? "Tu cuenta está verificada. Puedes publicar productos y contactar con compradores."
                : "Completa la verificación para publicar productos y generar confianza con compradores."}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64 shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Documentos</span>
            <span className="text-xs text-green-800 font-bold">
              {loaded} de {totalDocuments}
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-green-400 to-green-700"
              style={{ width: `${(loaded / totalDocuments) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
