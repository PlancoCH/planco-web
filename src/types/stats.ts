export interface DeviceStat {
  id: number;
  name: string;
  wifi_rssi: number | null;
  polling_rate: number;
  led_enabled: boolean;
  online: boolean;
  plant_count: number;
}

export interface PlantStats {
  total: number;
  owned: number;
  member_of: number;
}

export interface Distribution {
  good: number;
  fair: number;
  poor: number;
  unknown: number;
}

export interface HealthStats {
  average_plant_score: number | null;
  distribution: Distribution;
}

export interface RecentDataPoint {
  id: number;
  plant_id: number;
  plant_nickname: string;
  plant_score: number | null;
  temperature: number;
  humidity: number;
  soil_moisture: number;
  light_intensity: number;
  recorded_at: string;
}

export interface StatsResponse {
  devices: {
    total: number;
    list: DeviceStat[];
  };
  plants: PlantStats;
  health: HealthStats;
  unread_insights: number;
  recent_data: RecentDataPoint[];
}
