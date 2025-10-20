"use client";
import React, { useEffect } from 'react';
import { SettingsProvider } from "../providers/settings-context";
import ErrorBoundary from "../components/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store } from '../store';
import api from '../lib/http';
import { useAppDispatch } from '../store/hooks';
import { fetchProfileStart, fetchProfileSuccess, fetchProfileError } from '../store/slices/userSlice';
import { usePathname } from 'next/navigation';

function ProfileBootstrapper() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const isPublic = pathname === '/signin' || pathname === '/signup';
        if (isPublic) return;
      } catch {}
      try {
        const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : false;
        if (!hasToken) return;
      } catch {}
      try {
        dispatch(fetchProfileStart());
        const res = await api.get('/users/profile', { headers: { 'x-suppress-error-toast': '1' }, signal: controller.signal });
        const body: any = res.data;
        const payload = body && typeof body === 'object' && 'data' in body ? body.data : body;
        dispatch(fetchProfileSuccess(payload));
        try {
          if (payload?.fullName) localStorage.setItem('fullName', payload.fullName);
        } catch {}
      } catch (e: any) {
        if ((e as any)?.code !== 'ERR_CANCELED') dispatch(fetchProfileError(e?.message || 'Failed to load profile'));
      }
    })();
    return () => { controller.abort(); };
  }, [dispatch, pathname]);
  return null;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ProfileBootstrapper />
      <SettingsProvider>
        <ErrorBoundary>
          {children}
          <ToastContainer position="top-right" />
        </ErrorBoundary>
      </SettingsProvider>
    </Provider>
  );
}
