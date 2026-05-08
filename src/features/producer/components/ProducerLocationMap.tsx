import { LocationMap } from '../../../components/ui/LocationMap';

interface ProducerLocationMapProps {
  latitude: string;
  longitude: string;
  onChange: (latitude: string, longitude: string) => void;
}

export function ProducerLocationMap(props: ProducerLocationMapProps) {
  return <LocationMap {...props} />;
}
