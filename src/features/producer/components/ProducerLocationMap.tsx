import { useState } from 'react';
import { toast } from 'sonner';
import { Search, Navigation, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LocationMap } from '../../../components/ui/LocationMap';

interface ProducerLocationMapProps {
  latitude: string;
  longitude: string;
  onChange: (latitude: string, longitude: string) => void;
  isEditing?: boolean;
}

export function ProducerLocationMap({ latitude, longitude, onChange, isEditing = true }: ProducerLocationMapProps) {
  const [searchValue, setSearchValue] = useState('');
  const [flyToCoords, setFlyToCoords] = useState<[number, number] | null>(null);

  const handleUseCurrentLocation = () => {
    if (!isEditing) return;
    if (!navigator.geolocation) {
      toast.error('La geolocalización no es soportada por este navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = pos.coords.latitude;
        const newLng = pos.coords.longitude;
        onChange(newLat.toString(), newLng.toString());
        setFlyToCoords([newLat, newLng]);
      },
      () => {
        toast.error('No se pudo obtener la ubicación. Verifique los permisos de su navegador.');
      }
    );
  };

  const handleMapChange = (newLat: string, newLng: string) => {
    if (!isEditing) return;
    onChange(newLat, newLng);
    setFlyToCoords(null);
  };

  return (
    <Card
      className="xl:col-span-2 bg-white rounded-2xl border-gray-200 overflow-hidden"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
    >
      {isEditing && (
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar municipio o comunidad..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{ "--tw-ring-color": "#52B788" } as React.CSSProperties}
            />
          </div>
          <Button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #2D6A4F, #52B788)",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(45,106,79,0.3)",
            }}
            onClick={handleUseCurrentLocation}
          >
            <Navigation className="w-4 h-4" />
            Usar mi ubicación
          </Button>
        </div>
      )}

      <div className="relative">
        <LocationMap
          latitude={latitude}
          longitude={longitude}
          onChange={handleMapChange}
          readOnly={!isEditing}
          flyTo={flyToCoords}
          style={{ height: 460 }}
        />

        {isEditing && (
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-white text-xs z-[400] pointer-events-none"
            style={{
              background: "rgba(27,67,50,0.85)",
              backdropFilter: "blur(4px)",
              fontWeight: 500,
            }}
          >
            Haz clic en el mapa para mover el pin de ubicación
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-3 h-3 rounded-full" style={{ background: "#52B788" }} />
          Pin de ubicación activo
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <MapPin className="w-3 h-3" />
          Santa Cruz, Bolivia
        </div>
      </div>
    </Card>
  );
}
