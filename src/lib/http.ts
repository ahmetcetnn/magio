"use client";
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

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
  (res: AxiosResponse) => {
    try {
      const method = (res.config?.method || '').toUpperCase();
      const url = res.config?.url || '';
      const headers = (res.config?.headers || {}) as Record<string, any>;
      const suppressed = headers['x-suppress-toast'] === '1' || headers['x-suppress-toast'] === 1 || headers['x-suppress-toast'] === true;
      const suppressList = ['/users/refresh-token'];
      const isMutate = method && !['GET', 'HEAD', 'OPTIONS'].includes(method);
      if (isMutate && !suppressed && !suppressList.some((p) => url?.includes(p))) {
        const data: any = res.data;
        const explicit = headers['x-success-message'];
        const msg = explicit
          || data?.message
          || data?.result?.message
          || data?.data?.message
          || 'İşlem başarılı';
        toast.success(String(msg));
      }
    } catch {}
    return res;
  },
  async (error: AxiosError) => {
    const original: any = error.config || {};
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshRes = await api.post('/users/refresh-token');
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
      }
    }
    try {
      const method = (original?.method || '').toUpperCase();
      const url = original?.url || '';
      const headers = (original?.headers || {}) as Record<string, any>;
      const suppressed = headers['x-suppress-toast'] === '1' || headers['x-suppress-toast'] === 1 || headers['x-suppress-toast'] === true || headers['x-suppress-error-toast'] === '1';
      const suppressList = ['/users/refresh-token'];
      const isMutate = method && !['GET', 'HEAD', 'OPTIONS'].includes(method);
      if ((isMutate || (error.response?.status && error.response.status >= 400)) && !suppressed && !suppressList.some((p) => url?.includes(p))) {
        const data: any = error.response?.data;
        const msg = data?.message
          || data?.error
          || error.message
          || 'İşlem başarısız';
        toast.error(String(msg));
      }
    } catch {}
    return Promise.reject(error);
  }
);

export default api;
