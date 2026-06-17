import { request } from './client';
import type { Device, DeviceUpdatePayload } from '../types/device';
import type { MessageResponse } from '../types/auth';

export function getDevices(): Promise<Device[]> {
  return request<{ data: Device[] }>('/devices')
    .then(response => response.data);
}

export function getDevice(id: number): Promise<Device> {
    return request<{ data: Device }>(`/devices/${id}`)
    .then(response => response.data);
}

export function updateDevice(id: number, payload: DeviceUpdatePayload): Promise<Device> {
  return request<Device>(`/devices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function unmapDevice(id: number): Promise<MessageResponse> {
  return request<MessageResponse>(`/devices/${id}/unmap`, {
    method: 'POST',
  });
}
