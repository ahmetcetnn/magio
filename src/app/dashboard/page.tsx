"use client";

import React from 'react';
import { getFinancialSummary, getWorkingCapital, getWallet, getRecentTransactions, getScheduledTransfers } from '../../services/financial';
import Sidebar from '../../components/Sidebar';
import { toast } from 'react-toastify';
import { useSettings } from '../../providers/settings-context';
import DashboardLayout from '../../features/dashboard/layout/DashboardLayout';
import Topbar from '../../components/Topbar';
import SummaryCards from '../../features/dashboard/components/SummaryCards';
import WorkingCapitalSection from '../../features/dashboard/components/WorkingCapitalSection';
import WalletPanel from '../../features/dashboard/components/WalletPanel';
import { RecentTransactions, ScheduledTransfers } from '../../features/dashboard/components/TransactionsLists';
import { useAppSelector } from '../../store/hooks';
import { useQuery } from '@tanstack/react-query';

export default function DashboardPage() {
  const { currency, setCurrency } = useSettings();
  const fullName = useAppSelector((s) => s.user.profile?.fullName);

  const [authorized, setAuthorized] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    try {
      const t = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (!t) {
        setAuthorized(false);
        try { toast.error('An access token is required for authentication.'); } catch {}
        setTimeout(() => {
          window.location.replace('/signin');
        }, 0);
        return;
      }
      setAuthorized(true);
    } catch {
      setAuthorized(false);
      setTimeout(() => { window.location.replace('/signin'); }, 0);
    }
  }, []);

  const summaryQuery = useQuery({
    queryKey: ['financial-summary'],
    queryFn: ({ signal }) => getFinancialSummary(signal as AbortSignal),
    enabled: authorized === true,
  });

  const workingQuery = useQuery({
    queryKey: ['working-capital'],
    queryFn: ({ signal }) => getWorkingCapital(signal as AbortSignal),
    enabled: authorized === true,
  });

  const recentQuery = useQuery({
    queryKey: ['recent-transactions', 20],
    queryFn: ({ signal }) => getRecentTransactions(20, signal as AbortSignal),
    enabled: authorized === true,
  });

  const scheduledQuery = useQuery({
    queryKey: ['scheduled-transfers'],
    queryFn: ({ signal }) => getScheduledTransfers(signal as AbortSignal),
    enabled: authorized === true,
  });

  const walletQuery = useQuery({
    queryKey: ['wallet'],
    queryFn: ({ signal }) => getWallet(signal as AbortSignal),
    enabled: authorized === true,
  });

  const isLoading =
    summaryQuery.isLoading ||
    workingQuery.isLoading ||
    recentQuery.isLoading ||
    scheduledQuery.isLoading ||
    walletQuery.isLoading;

  React.useEffect(() => {
    const s = summaryQuery.data;
    if (s?.currency && s.currency !== currency) setCurrency(s.currency);
  }, [summaryQuery.data, currency, setCurrency]);

  const totals = summaryQuery.data?.totals ?? { balance: 0, spending: 0, saved: 0 };
  const chartPoints = workingQuery.data?.points ?? [];
  const cards = walletQuery.data?.cards ?? [];

  if (authorized === false) return null;

  return (
    <DashboardLayout sidebar={<Sidebar />} topbar={<Topbar fullName={fullName} />}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 flex flex-col gap-4">
          <SummaryCards loading={isLoading} totals={totals} />
          <WorkingCapitalSection loading={isLoading} data={chartPoints} />
          <RecentTransactions
            data={(recentQuery.data?.items ?? []) as any}
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
        <div className="flex flex-col gap-8">
          <WalletPanel loading={isLoading} cards={cards as any} />
          <ScheduledTransfers data={((scheduledQuery.data?.items ?? []) as any).map((t: any) => ({ ...t, amount: t.amount }))} loading={isLoading} />
        </div>
      </div>
    </DashboardLayout>
  );
}
