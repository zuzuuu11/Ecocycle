import type { Product } from '@/constants/products';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'ecocycle_access_token';

export function getApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '');
  }
  if (!__DEV__) {
    return 'http://127.0.0.1:3000/api';
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }
  return 'http://127.0.0.1:3000/api';
}

export async function getStoredToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setStoredToken(token: string | null): Promise<void> {
  try {
    if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
    else await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    /* secure store unavailable on some web builds */
  }
}

type Json = Record<string, unknown>;

async function parseJson(res: Response): Promise<Json> {
  const text = await res.text();
  try {
    return text ? (JSON.parse(text) as Json) : {};
  } catch {
    return {};
  }
}

export async function apiFetch<T = Json>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<{ ok: boolean; status: number; data: T }> {
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const body = options.body;
  if (body && typeof body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const { auth, ...fetchInit } = options;
  if (auth !== false) {
    const token = await getStoredToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...fetchInit, headers });
  const data = (await parseJson(res)) as T;
  return { ok: res.ok, status: res.status, data };
}

export type ApiUser = {
  id: string;
  email: string;
  displayName: string;
  impactKgCo2: number;
  points: number;
  pointsGoal: number;
};

export async function apiLogin(email: string, password: string) {
  return apiFetch<{ token: string; user: ApiUser; error?: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    auth: false,
  });
}

export async function apiRegister(email: string, password: string, displayName?: string) {
  return apiFetch<{ token: string; user: ApiUser; error?: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, displayName }),
    auth: false,
  });
}

export async function apiGetMe() {
  return apiFetch<{ user: ApiUser; error?: string }>('/me', { method: 'GET' });
}

export async function apiPatchMe(displayName: string) {
  return apiFetch<{ user: ApiUser; error?: string }>('/me', {
    method: 'PATCH',
    body: JSON.stringify({ displayName }),
  });
}

export async function apiRecordScan(barcode: string) {
  return apiFetch<{
    pointsAdded: number;
    impactAddedKg: number;
    user: ApiUser;
    error?: string;
  }>('/me/scan', {
    method: 'POST',
    body: JSON.stringify({ barcode }),
  });
}

export async function apiGetProduct(barcode: string) {
  return apiFetch<{ product: Product; error?: string }>(
    `/products/${encodeURIComponent(barcode)}`,
    { method: 'GET', auth: false }
  );
}

export type DisposalPartner = {
  id: string;
  name: string;
  distanceKm: number;
  ratingStars: number;
  reviewCount: number;
  collectionTime: string;
};

export type RecyclerRow = {
  id: string;
  title: string;
  subtitle: string;
  address: string;
  phone: string;
};

export async function apiGetDisposalPartners() {
  return apiFetch<{ partners: DisposalPartner[] }>('/catalog/disposal-partners', {
    method: 'GET',
    auth: false,
  });
}

export async function apiGetRecyclers() {
  return apiFetch<{ recyclers: RecyclerRow[] }>('/catalog/recyclers', {
    method: 'GET',
    auth: false,
  });
}

export type RewardTier = {
  id: string;
  title: string;
  discountLabel?: string;
  icon?: string;
  current: number;
  goal: number;
  progress: number;
};

export async function apiGetRewards() {
  return apiFetch<{
    points: number;
    pointsGoal: number;
    tiers: RewardTier[];
  }>('/catalog/rewards', { method: 'GET' });
}

export async function apiChatMessage(message: string) {
  return apiFetch<{ reply: string; error?: string }>('/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
    auth: false,
  });
}
