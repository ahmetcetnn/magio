import React from 'react';
import WorkingCapitalChart from '../charts/WorkingCapitalChart';
import { Skeleton } from '../ui/cards';

export default function WorkingCapitalSection({ loading, data }: { loading: boolean; data: { date: string; income: number; expenses: number }[] }) {
  return (
    <div className="xl:col-span-2">
      {loading ? <Skeleton className="h-72" /> : <WorkingCapitalChart data={data} />}
    </div>
  );
}
