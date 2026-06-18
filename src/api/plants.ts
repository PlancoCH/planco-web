import { request } from './client';
import type { Plant, PlantData, DailyInsight, PlantDataQuery } from '../types/plant';

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
