import { request } from './client';
import type { Plant } from '../types/plant';

export function getPlants(): Promise<Plant[]> {
  return request<{ data: Plant[] }>('/plants')
    .then(response => response.data);
}
