import { request } from './client';
import type { StatsResponse } from '../types/stats';

export function getStats(): Promise<StatsResponse> {
  return request<StatsResponse>('/stats');
}
