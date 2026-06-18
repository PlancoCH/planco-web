export interface PlantType {
  id: number;
  common_name: string;
  description: string | null;
  scientific_name: string;
  ideal_temp: number | null;
  ideal_moisture: number | null;
  ideal_light_lux: number | null;
  ideal_humidity: number | null;
  created_at: string;
  updated_at: string;
}

export interface PlantDevice {
  id: number;
  name: string;
  notes: string | null;
  polling_rate: number;
  wifi_rssi: number | null;
  led_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Plant {
  id: number;
  device_id: number | null;
  plant_type_id: number;
  nickname: string;
  notes: string | null;
  custom_image: string | null;
  sharing_token: string | null;
  created_at: string;
  updated_at: string;
  plant_type: PlantType;
  device: PlantDevice | null;
  role: 'owner' | 'member';
}

export interface PlantData {
  id: number;
  plant_id: number;
  plant_score: number | null;
  temperature: number;
  humidity: number;
  air_pressure: number | null;
  light_intensity: number;
  soil_moisture: number;
  created_at: string;
  updated_at: string;
}

export interface DailyInsight {
  id: number;
  plant_id: number;
  insight_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlantCreatePayload {
  nickname: string;
  notes?: string;
  plant_type_id: number;
  custom_image?: string;
}

export interface PlantUpdatePayload {
  nickname?: string;
  notes?: string | null;
  plant_type_id?: number;
  custom_image?: string;
}

export interface PaginatedPlantTypes {
  data: PlantType[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface PlantDataQuery {
  start_date?: string;
  end_date?: string;
}

export interface ShareTokenResponse {
  sharing_token: string;
}

export interface JoinPlantPayload {
  sharing_token: string;
}
