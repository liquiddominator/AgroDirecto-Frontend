export interface ProducerProfile {
  userId: number;
  producerType: string;
  farmName: string;
  municipality: string;
  province: string;
  department: string;
  experienceYears: number;
  geoLatitude: number | null;
  geoLongitude: number | null;
  geolocationCompleted: boolean;
}

export interface UpdateProducerLocationRequest {
  geoLatitude: number;
  geoLongitude: number;
}
