import { request } from './client';
import type { AccountUpdatePayload, AccountUpdateResponse } from '../types/auth';

export function updateAccount(payload: AccountUpdatePayload): Promise<AccountUpdateResponse> {
  return request<AccountUpdateResponse>('/auth/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
