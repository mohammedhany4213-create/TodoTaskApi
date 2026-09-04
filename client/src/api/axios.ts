import axios, { AxiosError } from 'axios';

const TOKEN_KEY = 'taskflow_auth_token';

export const authToken = {
  get: (): string | null => sessionStorage.getItem(TOKEN_KEY),
  set: (token: string): void => sessionStorage.setItem(TOKEN_KEY, token),
  remove: (): void => sessionStorage.removeItem(TOKEN_KEY),
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://localhost:7000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = authToken.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      authToken.remove();
      if (!['/login', '/register'].includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === 'string' && data.trim()) return data;

    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>;

      if (typeof record.message === 'string' && record.message) return record.message;
      if (typeof record.title === 'string' && record.title) return record.title;

      if (record.errors && typeof record.errors === 'object') {
        const messages = Object.values(record.errors as Record<string, string[]>)
          .flat()
          .filter(Boolean);
        if (messages.length) return messages.join(' ');
      }
    }
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default api;
