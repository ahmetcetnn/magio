"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/http';
import Sidebar from '../../components/Sidebar';
import { toast } from 'react-toastify';
import { useSettings } from '../../providers/settings-context';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/Topbar';
import SummaryCards from '../../components/dashboard/SummaryCards';
import WorkingCapitalSection from '../../components/dashboard/WorkingCapitalSection';
import WalletPanel from '../../components/dashboard/WalletPanel';
import { RecentTransactions, ScheduledTransfers } from '../../components/lists/Transactions';
import AuthGuard from './_authGuard';
import { useAppSelector } from '../../store/hooks';

type OverviewResponse = {
  totals: { balance: number; spending: number; saved: number };
  chart: { range: string; points: { date: string; income: number; expenses: number }[] };
  wallet: { cards: { bank: string; last4: string; brand: string; masked: string; exp: string }[] };
  recentTransactions: any[];
  scheduledTransfers: any[];
};

async function fetchOverview(): Promise<OverviewResponse> {
  // Use the app's local API route to get stubbed dashboard data for the UI
  const res = await fetch('/api/dashboard/overview', { credentials: 'same-origin' });
  if (!res.ok) throw new Error('Failed to load dashboard');
  return res.json();
}

type FinancialSummaryAPI = {
  success: boolean;
  message?: string;
  data: {
    totalBalance: { amount: number; currency: string; change: { percentage: number; trend: 'up' | 'down' } };
    totalExpense: { amount: number; currency: string; change: { percentage: number; trend: 'up' | 'down' } };
    totalSavings: { amount: number; currency: string; change: { percentage: number; trend: 'up' | 'down' } };
  };
};

async function fetchFinancialSummary(): Promise<{ totals: { balance: number; spending: number; saved: number }; currency: string }> {
  const res = await api.get<FinancialSummaryAPI>('/financial/summary');
  const body = res.data;
  const payload = (body as any)?.data ?? body;
  const currency = payload?.totalBalance?.currency || payload?.totalExpense?.currency || payload?.totalSavings?.currency || 'USD';
  return {
    totals: {
      balance: Number(payload?.totalBalance?.amount ?? 0),
      spending: Number(payload?.totalExpense?.amount ?? 0),
      saved: Number(payload?.totalSavings?.amount ?? 0),
    },
    currency,
  };
}

type WorkingCapitalAPI = {
  success: boolean;
  message?: string;
  data: {
    period: string;
    currency: string;
    data: Array<{ month: string; income: number; expense: number; net: number }>;
    summary: { totalIncome: number; totalExpense: number; netBalance: number };
  };
};

async function fetchWorkingCapital(): Promise<{ points: { date: string; income: number; expenses: number }[]; currency?: string }> {
  const res = await api.get<WorkingCapitalAPI>('/financial/working-capital');
  const body = res.data;
  const payload = (body as any)?.data ?? body;
  const points = (payload?.data ?? []).map((m: any) => ({
    date: String(m?.month ?? ''),
    income: Number(m?.income ?? 0),
    expenses: Number(m?.expense ?? 0),
  }));
  return { points, currency: payload?.currency };
}

type WalletAPI = {
  success: boolean;
  message?: string;
  data: {
    cards: Array<{
      id: string;
      name: string;
      type: string;
      cardNumber: string;
      bank: string;
      network: string;
      expiryMonth: number;
      expiryYear: number;
      color?: string;
      isDefault?: boolean;
    }>;
  };
};

function formatFullCard(num: string): { formatted: string; last4: string } {
  const digits = (num || '').replace(/\D+/g, '');
  const last4 = digits.slice(-4);
  const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
  return { formatted, last4 };
}

async function fetchWallet(): Promise<{ cards: { bank: string; last4: string; brand: string; masked: string; exp: string }[] }> {
  const res = await api.get<WalletAPI>('/financial/wallet');
  const body = res.data as any;
  const payload = body?.data ?? body;
  const cardsRaw: any[] = payload?.cards ?? [];
  const mapped = cardsRaw
    .slice()
    .sort((a, b) => (b?.isDefault === true ? 1 : 0) - (a?.isDefault === true ? 1 : 0))
    .map((c: any) => {
      const { formatted, last4 } = formatFullCard(String(c?.cardNumber ?? ''));
      const mm = String(Number(c?.expiryMonth ?? 0)).padStart(2, '0');
      const yy = String(c?.expiryYear ?? '').slice(-2);
      return {
        bank: String(c?.bank ?? ''),
        last4,
        brand: String(c?.network ?? ''),
        masked: formatted,
        exp: `${mm}/${yy}`,
      };
    });
  return { cards: mapped };
}

type RecentTransactionsAPI = {
  success: boolean;
  message?: string;
  data: {
    transactions: Array<{
      id: string;
      name: string;
      business?: string;
      image?: string;
      type: string;
      amount: number;
      currency: string;
      date: string;
      status?: string;
    }>;
  };
};

async function fetchRecentTransactions(limit = 20): Promise<{ items: { id: string; name: string; type: string; amount: number; date: string }[] }> {
  const res = await api.get<RecentTransactionsAPI>('/financial/transactions/recent', { params: { limit } });
  const body = res.data;
  const payload = (body as any)?.data ?? body;
  const items = (payload?.transactions ?? []).map((t: any) => ({
    id: String(t?.id ?? ''),
    name: String(t?.name ?? ''),
    type: String(t?.type ?? ''),
    amount: Number(t?.amount ?? 0),
    date: String(t?.date ?? ''),
  }));
  return { items };
}

type ScheduledTransfersAPI = {
  success: boolean;
  message?: string;
  data: {
    transfers: Array<{
      id: string;
      name: string;
      image?: string;
      date: string;
      amount: number;
      currency: string;
      status?: string;
    }>;
    summary?: { totalScheduledAmount: number; count: number };
  };
};

async function fetchScheduledTransfers(): Promise<{ items: { id: string; name: string; date: string; amount: number; currency?: string }[] }> {
  const res = await api.get<ScheduledTransfersAPI>('/financial/transfers/scheduled');
  const body = res.data;
  const payload = (body as any)?.data ?? body;
  const items = (payload?.transfers ?? []).map((t: any) => ({
    id: String(t?.id ?? ''),
    name: String(t?.name ?? ''),
    date: String(t?.date ?? ''),
    amount: Number(t?.amount ?? 0),
    currency: String(t?.currency ?? ''),
  }));
  return { items };
}

// Profile is fetched once on app bootstrap via ClientProviders

export default function DashboardPage() {
  const { currency, setCurrency } = useSettings();
  const { data: overview, isLoading: overviewLoading, isError: overviewError } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: fetchOverview,
    staleTime: 30_000,
  });
  const { data: summary, isLoading: summaryLoading, isError: summaryError } = useQuery({
    queryKey: ['financial-summary'],
    queryFn: fetchFinancialSummary,
    staleTime: 30_000,
  });
  const { data: workingCapital, isLoading: wcLoading, isError: wcError } = useQuery({
    queryKey: ['financial-working-capital'],
    queryFn: fetchWorkingCapital,
    staleTime: 30_000,
  });
  const { data: recentTx, isLoading: rtLoading, isError: rtError } = useQuery({
    queryKey: ['financial-recent-transactions', 20],
    queryFn: () => fetchRecentTransactions(20),
    staleTime: 30_000,
  });
  const { data: scheduled, isLoading: schLoading, isError: schError } = useQuery({
    queryKey: ['financial-scheduled-transfers'],
    queryFn: fetchScheduledTransfers,
    staleTime: 30_000,
  });
  const { data: wallet, isLoading: walletLoading, isError: walletError } = useQuery({
    queryKey: ['financial-wallet'],
    queryFn: fetchWallet,
    staleTime: 30_000,
  });
  const fullName = useAppSelector((s) => s.user.profile?.fullName);

  // Profile is already in redux; no duplicate fetch here

  React.useEffect(() => {
    if (overviewError) toast.error('Failed to load dashboard');
    if (summaryError) toast.error('Failed to load financial summary');
    if (wcError) toast.error('Failed to load working capital');
    if (rtError) toast.error('Failed to load recent transactions');
    if (walletError) toast.error('Failed to load wallet');
    if (schError) toast.error('Failed to load scheduled transfers');
  }, [overviewError, summaryError, wcError, rtError, walletError, schError]);

  // Update display currency from API once loaded
  React.useEffect(() => {
    if (summary?.currency && summary.currency !== currency) {
      setCurrency(summary.currency);
    }
  }, [summary?.currency, currency, setCurrency]);

  const totals = summary?.totals ?? overview?.totals ?? { balance: 0, spending: 0, saved: 0 };
  const chartPoints = workingCapital?.points ?? [];
  const cards = wallet?.cards ?? [];
  const isLoading = overviewLoading || summaryLoading || wcLoading || rtLoading || schLoading || walletLoading;

  return (
  <DashboardLayout sidebar={<Sidebar />} topbar={<Topbar fullName={fullName} />}>
      <AuthGuard />
      {/* Sol: 3 kart + Grafik + Recent, Sağ: Wallet + Scheduled */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 flex flex-col gap-4">
          {/* 1) Grafiğin üzerinde 3 kart */}
          <SummaryCards loading={isLoading} totals={totals} />
          <WorkingCapitalSection loading={isLoading} data={chartPoints} />
          {/* 3) Recent Transactions (3 items) with View all */}
          <RecentTransactions
            data={(recentTx?.items ?? []) as any}
            loading={isLoading}
            limit={3}
            action={
              <a href="/dashboard/transactions" className="text-sm font-medium inline-flex items-center gap-1" style={{ color: '#29A073' }}>
                View all
                <img src="/icons/arrowright.svg" alt="" width={12} height={12} />
              </a>
            }
          />
        </div>
        <div className="flex flex-col gap-4">
          <WalletPanel loading={isLoading} cards={cards as any} />
          <ScheduledTransfers data={((scheduled?.items ?? []) as any).map((t: any) => ({ ...t, amount: t.amount }))} loading={isLoading} />
        </div>
      </div>
    </DashboardLayout>
  );
}
