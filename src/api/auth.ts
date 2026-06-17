import { request } from './client';
import type { User, AuthResponse, MessageResponse } from '../types/auth';

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export function signup(payload: SignupPayload): Promise<MessageResponse> {
  return request<MessageResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function logout(): Promise<MessageResponse> {
  return request<MessageResponse>('/auth/logout', {
    method: 'POST',
  });
}

export function getMe(): Promise<{ user: User }> {
  return request<{ user: User }>('/auth/me');
}

export function resendVerification(email: string): Promise<MessageResponse> {
  return request<MessageResponse>('/auth/email/verification-notification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
