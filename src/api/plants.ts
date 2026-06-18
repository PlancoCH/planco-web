import { request } from './client';
import type { Plant, PlantData, DailyInsight, PlantDataQuery, PlantUpdatePayload, PlantCreatePayload, PaginatedPlantTypes } from '../types/plant';
import type { MessageResponse } from '../types/auth';

export function getPlants(): Promise<Plant[]> {
  return request<{ data: Plant[] }>('/plants')
    .then(response => response.data);
}

export function getPlant(id: number): Promise<Plant> {
  return request<{ data: Plant }>(`/plants/${id}`)
    .then(response => response.data);
}

export function getPlantData(id: number, query?: PlantDataQuery): Promise<PlantData[]> {
  const params = new URLSearchParams();
  if (query?.start_date) params.append('start_date', query.start_date);
  if (query?.end_date) params.append('end_date', query.end_date);
  const qs = params.toString();
  const endpoint = qs ? `/plants/${id}/data?${qs}` : `/plants/${id}/data`;
  return request< { data: PlantData[] } >(endpoint)
  .then(response => response.data);
}

export function getPlantInsights(plantId: number): Promise<DailyInsight[]> {
  return request<{ data: DailyInsight[] }>(`/plants/${plantId}/insights`).then(response => response.data);
}

export function markInsightAsRead(plantId: number, insightId: number): Promise<DailyInsight> {
  return request<{ message: string; data: DailyInsight }>(
    `/plants/${plantId}/insights/${insightId}/read`,
    { method: 'PATCH' },
  ).then(response => response.data);
}

export function updatePlant(id: number, payload: PlantUpdatePayload): Promise<Plant> {
  return request<{ data: Plant }>(`/plants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }).then(response => response.data);
}

export function deletePlant(id: number): Promise<MessageResponse> {
  return request<MessageResponse>(`/plants/${id}`, {
    method: 'DELETE',
  });
}

export function mapPlantDevice(plantId: number, deviceId: number): Promise<Plant> {
  return request<{ data: Plant }>(`/plants/${plantId}/map`, {
    method: 'POST',
    body: JSON.stringify({ device_id: deviceId }),
  }).then(response => response.data);
}

export function unmapPlantDevice(plantId: number): Promise<MessageResponse> {
  return request<MessageResponse>(`/plants/${plantId}/unmap`, {
    method: 'POST',
  });
}

export function getPlantTypes(search?: string, page?: number): Promise<PaginatedPlantTypes> {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (page && page > 1) params.append('page', String(page));
  const qs = params.toString();
  return request<PaginatedPlantTypes>(`/plant-types${qs ? `?${qs}` : ''}`);
}

export function createPlant(payload: PlantCreatePayload): Promise<Plant> {
  return request<{ data: Plant }>('/plants', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(response => response.data);
}
