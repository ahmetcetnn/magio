"use client";
import React, { useEffect } from 'react';
import QueryProvider from "../providers/query-provider";
import { SettingsProvider } from "../providers/settings-context";
import ErrorBoundary from "../components/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store } from '../store';
import api from '../lib/http';
import { useAppDispatch } from '../store/hooks';
import { fetchProfileStart, fetchProfileSuccess, fetchProfileError } from '../store/slices/userSlice';

function ProfileBootstrapper() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        dispatch(fetchProfileStart());
        const res = await api.get('/users/profile');
        if (!mounted) return;
        const body: any = res.data;
        const payload = body && typeof body === 'object' && 'data' in body ? body.data : body;
        dispatch(fetchProfileSuccess(payload));
        try {
          if (payload?.fullName) localStorage.setItem('fullName', payload.fullName);
        } catch {}
      } catch (e: any) {
        if (!mounted) return;
        dispatch(fetchProfileError(e?.message || 'Failed to load profile'));
      }
    })();
    return () => { mounted = false; };
  }, [dispatch]);
  return null;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ProfileBootstrapper />
      <QueryProvider>
        <SettingsProvider>
          <ErrorBoundary>
            {children}
            <ToastContainer position="top-right" />
          </ErrorBoundary>
        </SettingsProvider>
      </QueryProvider>
    </Provider>
  );
}
