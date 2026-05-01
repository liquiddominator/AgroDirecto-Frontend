import { useMemo } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SANTA_CRUZ_BOLIVIA } from '../../../lib/maps/mapDefaults';

interface ProducerLocationMapProps {
  latitude: string;
  longitude: string;
  onChange: (latitude: string, longitude: string) => void;
}

export function ProducerLocationMap({
  latitude,
  longitude,
  onChange,
}: ProducerLocationMapProps) {
  const selectedPosition = useMemo<[number, number] | null>(() => {
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
    <div className="map-field">
      <MapContainer center={center} zoom={SANTA_CRUZ_BOLIVIA.zoom} className="location-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationPicker onChange={onChange} />
        {selectedPosition && <Marker position={selectedPosition} icon={markerIcon} />}
      </MapContainer>
    </div>
  );
}

function LocationPicker({ onChange }: { onChange: ProducerLocationMapProps['onChange'] }) {
  useMapEvents({
    click(event) {
      onChange(event.latlng.lat.toFixed(7), event.latlng.lng.toFixed(7));
    },
  });

  return null;
}

const markerIcon = divIcon({
  className: 'farm-marker',
  html: '<span></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});
