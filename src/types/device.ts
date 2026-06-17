export interface Device {
  id: number;
  name: string;
  notes: string | null;
  polling_rate: number;
  wifi_rssi: number | null;
  led_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeviceUpdatePayload {
  name?: string;
  notes?: string | null;
  polling_rate?: number;
  led_enabled?: boolean;
}
