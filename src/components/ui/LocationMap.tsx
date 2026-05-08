import { useMemo } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SANTA_CRUZ_BOLIVIA } from '../../lib/maps/mapDefaults';

interface LocationMapProps {
  latitude?: string | number | null;
  longitude?: string | number | null;
  onChange?: (latitude: string, longitude: string) => void;
  readOnly?: boolean;
}

export function LocationMap({ latitude, longitude, onChange, readOnly = false }: LocationMapProps) {
  const selectedPosition = useMemo<[number, number] | null>(() => {
    if (!latitude || !longitude) return null;

    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    if (Number.isFinite(parsedLatitude) && Number.isFinite(parsedLongitude)) {
      return [parsedLatitude, parsedLongitude];
    }
    return null;
  }, [latitude, longitude]);

  const center: [number, number] = selectedPosition ?? [
    SANTA_CRUZ_BOLIVIA.latitude,
    SANTA_CRUZ_BOLIVIA.longitude,
  ];

  return (
    <div className="w-full" style={{ height: '400px' }}>
      <MapContainer center={center} zoom={SANTA_CRUZ_BOLIVIA.zoom} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!readOnly && onChange && <LocationPicker onChange={onChange} />}
        <Marker position={selectedPosition || center} icon={markerIcon} />
      </MapContainer>
    </div>
  );
}

function LocationPicker({ onChange }: { onChange: (lat: string, lng: string) => void }) {
  useMapEvents({
    click(event) {
      onChange(event.latlng.lat.toFixed(7), event.latlng.lng.toFixed(7));
    },
  });
  return null;
}

const markerIcon = divIcon({
  className: "",
  html: `
    <div style="position:relative;width:44px;height:50px;display:flex;flex-direction:column;align-items:center;">
      <div style="width:44px;height:44px;background:linear-gradient(135deg,#2D6A4F,#52B788);border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(45,106,79,0.5);border:3px solid white;display:flex;align-items:center;justify-content:center;">
        <div style="transform:rotate(45deg);width:12px;height:12px;background:white;border-radius:50%;"></div>
      </div>
    </div>
  `,
  iconSize: [44, 50],
  iconAnchor: [22, 50],
  popupAnchor: [0, -50],
});