import { request } from './client';
import type { Device } from '../types/device';

export function getDevices(): Promise<Device[]> {
  return request<{ data: Device[] }>('/devices')
    .then(response => response.data);
}
