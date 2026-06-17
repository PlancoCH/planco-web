export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface MessageResponse {
  message: string;
}

export interface ValidationErrors {
  message: string;
  errors: Record<string, string[]>;
}

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
  plant_type?: PlantType;
  device?: Device | null;
  role?: 'owner' | 'member';
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

export interface PaginatedResponse<T> {
  data: T[];
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
