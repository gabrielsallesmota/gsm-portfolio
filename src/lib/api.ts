const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.gabrielmotadev.com.br';
const TOKEN_KEY = 'gsm-portfolio-token';

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: Method;
  body?: unknown;
  auth?: boolean;
  headers?: Record<string, string>;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false, headers = {} } = options;
  const token = getToken();

  const requestHeaders: Record<string, string> = {
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  };

  if (auth && token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const data = await response.json();
      detail = data.detail || detail;
    } catch {
      // fallback to status text when body is not JSON
    }
    throw new Error(detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
