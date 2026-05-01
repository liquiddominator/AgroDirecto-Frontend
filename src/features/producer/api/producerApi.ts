import { apiRequest, toJsonBody } from '../../../lib/api/httpClient';
import type {
  ProducerProfile,
  UpdateProducerLocationRequest,
} from '../types/producerTypes';

export function getCurrentProducerProfile() {
  return apiRequest<ProducerProfile>('/api/producers/me/profile');
}

export function updateCurrentProducerLocation(request: UpdateProducerLocationRequest) {
  return apiRequest<ProducerProfile>('/api/producers/me/location', {
    method: 'PATCH',
    body: toJsonBody(request),
  });
}
