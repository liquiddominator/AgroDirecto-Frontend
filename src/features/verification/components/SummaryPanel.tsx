import { ShieldCheck, Send, Info, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SummaryPanelProps {
  loaded: number;
  pending: number;
  approved: number;
  rejected: number;
  totalDocuments: number;
  documentTypes: string[];
}

export function SummaryPanel({
  loaded,
  pending,
  approved,
  rejected,
  totalDocuments,
  documentTypes,
}: SummaryPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <Card
        className="bg-white rounded-2xl border-slate-200 shadow-sm"
      >
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-100"
            >
              <ShieldCheck className="w-4 h-4 text-green-800" />
            </div>
            <h3 className="text-slate-900 text-base font-bold">
              Resumen de verificación
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: "Cargados", value: loaded, bgClass: "bg-slate-50", textClass: "text-slate-700", accentClass: "text-green-800" },
              { label: "Pendientes", value: pending, bgClass: "bg-yellow-50", textClass: "text-yellow-800", accentClass: "text-yellow-600" },
              { label: "Aprobados", value: approved, bgClass: "bg-green-100", textClass: "text-green-900", accentClass: "text-green-600" },
              { label: "Rechazados", value: rejected, bgClass: "bg-red-100", textClass: "text-red-900", accentClass: "text-red-600" },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl p-3 text-center ${stat.bgClass}`}
              >
                <p className={`text-2xl font-bold ${stat.accentClass}`}>
                  {stat.value}
                </p>
                <p className={`text-xs mt-0.5 font-medium ${stat.textClass}`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-5">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500">Verificación</span>
              <span className="text-green-800 font-semibold">
                {Math.round((approved / totalDocuments) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-700 transition-all duration-500 ease-in-out"
                style={{ width: `${(approved / totalDocuments) * 100}%` }}
              />
            </div>
          </div>

        </CardContent>
      </Card>

      <Card
        className="rounded-2xl border border-blue-200 bg-blue-50"
      >
        <CardContent className="p-4 flex gap-2.5">
          <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
          <p className="text-xs text-blue-800 leading-relaxed">
            Los documentos serán revisados por un administrador. Recibirás una
            notificación cuando tu cuenta sea aprobada o si necesitas corregir algún archivo.
          </p>
        </CardContent>
      </Card>

      <Card
        className="bg-white rounded-2xl border-slate-200 shadow-sm"
      >
        <CardContent className="p-5">
          <p className="text-xs text-slate-500 uppercase mb-3 font-semibold tracking-wider">
            Tipos aceptados
          </p>
          <div className="space-y-1.5">
            {documentTypes.map((type) => (
              <div key={type} className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-green-400" />
                {type}
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Formatos: PDF, JPG, PNG — Máx. 10 MB
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
