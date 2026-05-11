import { Map, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FarmInfoCardProps {
  isRegistered: boolean;
  farmName?: string | null;
  municipality?: string | null;
  province?: string | null;
  department?: string | null;
}

export function FarmInfoCard({ isRegistered, farmName, municipality, province, department }: FarmInfoCardProps) {
  return (
    <Card
      className="bg-white rounded-2xl border-gray-200"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
    >
      <CardContent className="p-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #D8F3DC, #B7E4C7)" }}
          >
            <Map className="w-6 h-6" style={{ color: "#2D6A4F" }} />
          </div>
          <div>
            <h2 className="text-gray-900 text-lg" style={{ fontWeight: 700 }}>
              {farmName || 'Finca sin nombre'}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {municipality && <span className="text-gray-500 text-sm">{municipality}</span>}
              {municipality && province && <span className="text-gray-300">•</span>}
              {province && <span className="text-gray-500 text-sm">{province}</span>}
              {province && department && <span className="text-gray-300">•</span>}
              {department && <span className="text-gray-500 text-sm">{department}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isRegistered ? (
            <Badge
              variant="secondary"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm"
              style={{
                background: "#D8F3DC",
                color: "#1B4332",
                fontWeight: 600,
              }}
            >
              <CheckCircle className="w-4 h-4" style={{ color: "#52B788" }} />
              Ubicación registrada
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm"
              style={{
                background: "#FFF3CD",
                color: "#856404",
                fontWeight: 600,
              }}
            >
              <AlertCircle className="w-4 h-4" style={{ color: "#F4A261" }} />
              Ubicación pendiente
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}