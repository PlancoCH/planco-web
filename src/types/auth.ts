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

export interface AccountUpdatePayload {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}

export interface AccountUpdateResponse {
  message: string;
  user: User;
}
