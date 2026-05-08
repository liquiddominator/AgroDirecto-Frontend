import { useState, useEffect } from 'react';
import { FarmInfoCard } from './geolocation/FarmInfoCard';
import { ImportantInfoCard } from './geolocation/ImportantInfoCard';
import { CoordinatesPanel } from './geolocation/CoordinatesPanel';
import { ProducerLocationMap } from './ProducerLocationMap';
import * as producerApi from '../api/producerApi';
import type { ProducerProfile } from '../types/producerTypes';
import { resolveErrorMessage } from '../../../utils/errorUtils';
import { toast } from 'sonner';

interface ProducerLocationPanelProps {
  profile: ProducerProfile;
  onProfileUpdate: (updatedProfile: ProducerProfile) => void;
}

export function ProducerLocationPanel({ profile, onProfileUpdate }: ProducerLocationPanelProps) {
  const [latitude, setLatitude] = useState(profile.geoLatitude?.toString() ?? '');
  const [longitude, setLongitude] = useState(profile.geoLongitude?.toString() ?? '');
  const [isEditing, setIsEditing] = useState(!profile.geolocationCompleted);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setLatitude(profile.geoLatitude?.toString() ?? '');
      setLongitude(profile.geoLongitude?.toString() ?? '');
    }
  }, [profile, isEditing]);

  const handleSaveLocation = async () => {
    if (!latitude || !longitude) {
      toast.error('Debe marcar una ubicación en el mapa antes de guardar.');
      return;
    }

    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);
    if (!Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude)) {
      toast.error('Las coordenadas seleccionadas no son válidas.');
      return;
    }

    setIsSaving(true);
    try {
      const updatedProfile = await producerApi.updateCurrentProducerLocation({
        geoLatitude: parsedLatitude,
        geoLongitude: parsedLongitude,
      });
      onProfileUpdate(updatedProfile);
      setIsEditing(false);
      toast.success('Ubicación guardada correctamente.');
    } catch (caughtError) {
      toast.error(resolveErrorMessage(caughtError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setLatitude(profile.geoLatitude?.toString() ?? '');
    setLongitude(profile.geoLongitude?.toString() ?? '');
    setIsEditing(false);
  };

  const parsedLat = parseFloat(latitude);
  const parsedLng = parseFloat(longitude);
  const position: [number, number] = !isNaN(parsedLat) && !isNaN(parsedLng)
    ? [parsedLat, parsedLng]
    : [-17.7833, -63.1821]; // Coordenadas predeterminadas

  return (
    <div className="space-y-6">
      {!profile.geolocationCompleted && <ImportantInfoCard />}

      <FarmInfoCard
        isRegistered={profile.geolocationCompleted}
        farmName={profile.farmName}
        municipality={profile.municipality}
        province={profile.province}
        department={profile.department}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ProducerLocationMap
            latitude={latitude}
            longitude={longitude}
            onChange={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
            isEditing={isEditing}
          />
        </div>
        <div className="xl:col-span-1">
          <CoordinatesPanel
            position={position}
            isRegistered={profile.geolocationCompleted}
            isEditing={isEditing}
            isSaving={isSaving}
            onConfirm={handleSaveLocation}
            onEditToggle={isEditing ? handleCancelEdit : () => setIsEditing(true)}
          />
        </div>
      </div>
    </div>
  );
}