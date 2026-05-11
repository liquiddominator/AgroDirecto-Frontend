import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ImportantInfoCard() {
  return (
    <Card
      className="rounded-2xl border"
      style={{
        background: "#FFFBF0",
        borderColor: "#FFE082",
      }}
    >
      <CardContent className="p-4 flex gap-3">
        <AlertCircle
          className="w-5 h-5 shrink-0 mt-0.5"
          style={{ color: "#F4A261" }}
        />
        <div>
          <p className="text-sm" style={{ color: "#856404", fontWeight: 600 }}>
            Importante
          </p>
          <p className="text-xs mt-1" style={{ color: "#A07800", lineHeight: 1.5 }}>
            Debes registrar la ubicación de tu predio antes de publicar
            productos. Esta información ayuda a los compradores a filtrar por cercanía.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}