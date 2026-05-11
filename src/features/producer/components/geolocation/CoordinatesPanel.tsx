import { MapPin, Info, RefreshCw, Edit3, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CoordinatesPanelProps {
  position: [number, number];
  isRegistered: boolean;
  isEditing: boolean;
  isSaving: boolean;
  onConfirm: () => void;
  onEditToggle: () => void;
}

export function CoordinatesPanel({
  position,
  isRegistered,
  isEditing,
  isSaving,
  onConfirm,
  onEditToggle,
}: CoordinatesPanelProps) {
  return (
    <Card
      className="bg-white rounded-2xl border-gray-200"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#D8F3DC" }}
          >
            <MapPin className="w-4 h-4" style={{ color: "#2D6A4F" }} />
          </div>
          <h3 className="text-gray-900 text-base" style={{ fontWeight: 700 }}>
            Datos de ubicación
          </h3>
        </div>

        <div className="space-y-3 mb-4">
          <div
            className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: "#F5F7F2" }}
          >
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Latitud</p>
              <p
                className="text-gray-900 text-sm font-mono"
                style={{ fontWeight: 600 }}
              >
                {position[0].toFixed(7)}
              </p>
            </div>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "#D8F3DC" }}
            >
              <span
                className="text-xs"
                style={{ color: "#2D6A4F", fontWeight: 700 }}
              >
                N
              </span>
            </div>
          </div>

          <div
            className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: "#F5F7F2" }}
          >
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Longitud</p>
              <p
                className="text-gray-900 text-sm font-mono"
                style={{ fontWeight: 600 }}
              >
                {position[1].toFixed(7)}
              </p>
            </div>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "#FFF3CD" }}
            >
              <span
                className="text-xs"
                style={{ color: "#856404", fontWeight: 700 }}
              >
                W
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 flex items-start gap-1.5 mb-5">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          Estas coordenadas se guardarán en tu perfil de productor.
        </p>

        <div className="space-y-2.5">
        {isEditing && (
          <Button
            onClick={onConfirm}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #2D6A4F, #52B788)",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(45,106,79,0.35)",
            }}
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : isRegistered ? <RefreshCw className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            {isSaving ? "Guardando..." : isRegistered ? "Actualizar ubicación" : "Confirmar ubicación"}
          </Button>
        )}
        {(!isEditing || isRegistered) && (
          <Button
            variant="outline"
            onClick={onEditToggle}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ fontWeight: 500 }}
          >
            {isEditing ? <XCircle className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {isEditing ? "Cancelar edición" : "Editar ubicación"}
          </Button>
        )}
        </div>
      </CardContent>
    </Card>
  );
}