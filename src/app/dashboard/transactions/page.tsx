"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
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

async function fetchRecent(page: number, pageSize: number): Promise<Transaction[]> {
  const res = await api.get<RecentTransactionsAPI>('/financial/transactions/recent', {
    params: { limit: pageSize, offset: (page - 1) * pageSize },
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
  const { data, isLoading, isError } = useQuery<Transaction[]>({
    queryKey: ['transactions', page, pageSize],
    queryFn: () => fetchRecent(page, pageSize),
    staleTime: 30_000,
  });

  React.useEffect(() => {
    if (isError) toast.error('Failed to load transactions');
  }, [isError]);

  const items: Transaction[] | [] = data ?? [];

  return (
    <DashboardLayout sidebar={<Sidebar />} topbar={<Topbar />}> 
      <AuthGuard />
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
