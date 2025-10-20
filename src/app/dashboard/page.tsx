"use client";

import React from 'react';
import { getFinancialSummary, getWorkingCapital, getWallet, getRecentTransactions, getScheduledTransfers } from '../../services/financial';
import Sidebar from '../../components/Sidebar';
import { toast } from 'react-toastify';
import { useSettings } from '../../providers/settings-context';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/Topbar';
import SummaryCards from '../../components/dashboard/SummaryCards';
import WorkingCapitalSection from '../../components/dashboard/WorkingCapitalSection';
import WalletPanel from '../../components/dashboard/WalletPanel';
import { RecentTransactions, ScheduledTransfers } from '../../components/lists/Transactions';
import { useAppSelector } from '../../store/hooks';

export default function DashboardPage() {
  const { currency, setCurrency } = useSettings();
  const fullName = useAppSelector((s) => s.user.profile?.fullName);

  const [authorized, setAuthorized] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [summary, setSummary] = React.useState<Awaited<ReturnType<typeof getFinancialSummary>> | null>(null);
  const [workingCapital, setWorkingCapital] = React.useState<Awaited<ReturnType<typeof getWorkingCapital>> | null>(null);
  const [recentTx, setRecentTx] = React.useState<Awaited<ReturnType<typeof getRecentTransactions>> | null>(null);
  const [scheduled, setScheduled] = React.useState<Awaited<ReturnType<typeof getScheduledTransfers>> | null>(null);
  const [wallet, setWallet] = React.useState<Awaited<ReturnType<typeof getWallet>> | null>(null);

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

  React.useEffect(() => {
    if (!authorized) return;
    const controller = new AbortController();
    setIsLoading(true);
    (async () => {
      try {
        const [s, wc, rt, sch, w] = await Promise.all([
          getFinancialSummary(controller.signal).catch((e) => {
            if ((e as any)?.code !== 'ERR_CANCELED') toast.error('Failed to load financial summary');
            return null;
          }),
          getWorkingCapital(controller.signal).catch((e) => {
            if ((e as any)?.code !== 'ERR_CANCELED') toast.error('Failed to load working capital');
            return null;
          }),
          getRecentTransactions(20, controller.signal).catch((e) => {
            if ((e as any)?.code !== 'ERR_CANCELED') toast.error('Failed to load recent transactions');
            return null;
          }),
          getScheduledTransfers(controller.signal).catch((e) => {
            if ((e as any)?.code !== 'ERR_CANCELED') toast.error('Failed to load scheduled transfers');
            return null;
          }),
          getWallet(controller.signal).catch((e) => {
            if ((e as any)?.code !== 'ERR_CANCELED') toast.error('Failed to load wallet');
            return null;
          }),
        ]);
        if (s) setSummary(s);
        if (wc) setWorkingCapital(wc);
        if (rt) setRecentTx(rt);
        if (sch) setScheduled(sch);
        if (w) setWallet(w);
        if (s?.currency && s.currency !== currency) setCurrency(s.currency);
      } finally {
        setIsLoading(false);
      }
    })();
    return () => { controller.abort(); };
  }, [authorized, setCurrency, currency]);

  const totals = summary?.totals ?? { balance: 0, spending: 0, saved: 0 };
  const chartPoints = workingCapital?.points ?? [];
  const cards = wallet?.cards ?? [];

  if (authorized === false) return null;

  return (
    <DashboardLayout sidebar={<Sidebar />} topbar={<Topbar fullName={fullName} />}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 flex flex-col gap-4">
          <SummaryCards loading={isLoading} totals={totals} />
          <WorkingCapitalSection loading={isLoading} data={chartPoints} />
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
        <div className="flex flex-col gap-8">
          <WalletPanel loading={isLoading} cards={cards as any} />
          <ScheduledTransfers data={((scheduled?.items ?? []) as any).map((t: any) => ({ ...t, amount: t.amount }))} loading={isLoading} />
        </div>
      </div>
    </DashboardLayout>
  );
}
