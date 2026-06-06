import apiClient from './client';
import type { AuthTokens, User } from '../types';

export async function login(username: string, password: string): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/login', { username, password });
  return data;
}

export async function register(payload: {
  name: string;
  email: string;
  username: string;
  password: string;
  avatar: string;
}): Promise<{ message: string; redirect: string }> {
  const { data } = await apiClient.post('/register', payload);
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<{ user: User }>('/me');
  return data.user;
}

export async function changePassword(
  current_password: string,
  new_password: string
): Promise<{ message: string }> {
  const { data } = await apiClient.put('/change-password', { current_password, new_password });
  return data;
}
