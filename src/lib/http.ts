"use client";
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original: any = error.config || {};
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        // Refresh using httpOnly refresh cookie and include current access token in body
        let currentToken: string | null = null;
        try { currentToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null; } catch {}
        const refreshRes = await api.post('/users/refresh-token', currentToken ? { accessToken: currentToken } : {});
        const newToken = (refreshRes.data as any)?.accessToken
          || (refreshRes.data as any)?.token
          || (refreshRes.data as any)?.data?.accessToken
          || (refreshRes.data as any)?.result?.accessToken
          || (refreshRes.data as any)?.result?.token;
        const newRefresh = (refreshRes.data as any)?.refreshToken
          || (refreshRes.data as any)?.data?.refreshToken
          || (refreshRes.data as any)?.result?.refreshToken;
        if (newToken) {
          try { localStorage.setItem('accessToken', String(newToken)); } catch {}
          if (newRefresh) {
            try { localStorage.setItem('refreshToken', String(newRefresh)); } catch {}
          }
          original.headers = original.headers || {};
          original.headers['Authorization'] = `Bearer ${newToken}`;
          return api(original);
        }
      } catch (e) {
        // fallthrough to reject
      }
    }
    return Promise.reject(error);
  }
);

export default api;
