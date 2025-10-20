"use client";

import React from 'react';
import Sidebar from '../../../components/Sidebar';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Topbar from '../../../components/Topbar';
import { RecentTransactions, Transaction } from '../../../components/lists/Transactions';
import { toast } from 'react-toastify';
import api from '../../../lib/http';
import AuthGuard from '../_authGuard';

type RecentTransactionsAPI = {
  success: boolean;
  data: {
    transactions: Array<{
      id: string;
      name: string;
      type: string;
      amount: number;
      currency: string;
      date: string;
      status?: string;
    }>;
  };
};

async function fetchRecent(page: number, pageSize: number, signal?: AbortSignal): Promise<Transaction[]> {
  const res = await api.get<RecentTransactionsAPI>('/financial/transactions/recent', {
    params: { limit: pageSize, offset: (page - 1) * pageSize },
    signal,
  });
  const payload: any = (res.data as any)?.data ?? res.data;
  return (payload?.transactions ?? []).map((t: any) => ({
    id: String(t?.id ?? ''),
    name: String(t?.name ?? ''),
    type: String(t?.type ?? ''),
    amount: Number(t?.amount ?? 0),
    date: String(t?.date ?? ''),
  }));
}

export default function TransactionsPage() {
  const pageSize = 15;
  const [page, setPage] = React.useState(1);
  const [items, setItems] = React.useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [authorized, setAuthorized] = React.useState<boolean | null>(null);

  // Check token and redirect early
  React.useEffect(() => {
    try {
      const t = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (!t) {
        setAuthorized(false);
        try { toast.error('An access token is required for authentication.'); } catch {}
        setTimeout(() => { window.location.replace('/signin'); }, 0);
        return;
      }
      setAuthorized(true);
    } catch {
      setAuthorized(false);
      try { toast.error('An access token is required for authentication.'); } catch {}
      setTimeout(() => { window.location.replace('/signin'); }, 0);
    }
  }, []);

  const load = React.useCallback((p: number) => {
    const controller = new AbortController();
    setIsLoading(true);
    fetchRecent(p, pageSize, controller.signal)
      .then((data) => setItems(data))
      .catch((e) => { if ((e as any)?.code !== 'ERR_CANCELED') toast.error('Failed to load transactions'); })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, []);

  React.useEffect(() => {
    if (!authorized) return;
    const cancel = load(page);
    return () => { if (typeof cancel === 'function') cancel(); };
  }, [page, load, authorized]);

  if (authorized === false) return null;

  return (
    <DashboardLayout sidebar={<Sidebar />} topbar={<Topbar />}> 
      <div className="grid grid-cols-1 gap-4">
        <RecentTransactions data={items as any} loading={isLoading} title="Transactions" />
        <div className="flex items-center justify-between">
          <button
            className="px-3 py-2 rounded-lg text-sm border border-gray-200 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page}</span>
          <button
            className="px-3 py-2 rounded-lg text-sm border border-gray-200 disabled:opacity-50"
            onClick={() => setPage((p) => p + 1)}
            disabled={isLoading || (items.length < pageSize)}
          >
            Next
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
