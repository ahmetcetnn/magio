import React from 'react';
import { Section, Skeleton } from '../../../components/ui/cards';
import { useSettings } from '../../../providers/settings-context';

export type Transaction = {
  id: string;
  name: string;
  type: string;
  amount: number;
  date: string;
};

export function RecentTransactions({ data, loading, title = 'Recent Transaction', action, limit }: { data: Transaction[]; loading?: boolean; title?: string; action?: React.ReactNode; limit?: number }) {
  const { formatMoney, formatDate } = useSettings();
  const display = React.useMemo(() => (limit ? data.slice(0, limit) : data), [data, limit]);
  return (
    <section className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 p-4">
      <Section title={title} action={action} />
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 pr-4 font-medium">NAME/BUSINESS</th>
                <th className="py-2 px-4 font-medium text-center">TYPE</th>
                <th className="py-2 px-4 font-medium text-center">AMOUNT</th>
                <th className="py-2 pl-4 font-medium text-center">DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {display.map((t) => (
                <tr key={t.id}>
                  <td className="py-3 pr-4 text-gray-900 font-medium">{t.name}</td>
                  <td className="py-3 px-4 text-gray-600 text-center">{t.type}</td>
                  <td className="py-3 px-4 text-gray-900 font-semibold text-center">{formatMoney(t.amount)}</td>
                  <td className="py-3 pl-4 text-gray-600 text-center whitespace-nowrap">{formatDate(t.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {display.length === 0 && (
            <div className="py-6 text-center text-sm text-gray-500">No transactions</div>
          )}
        </div>
      )}
    </section>
  );
}

export type Transfer = {
  id: string;
  name: string;
  date: string;
  amount: number;
};

export function ScheduledTransfers({ data, loading }: { data: Transfer[]; loading?: boolean }) {
  const { formatMoney, formatDate } = useSettings();
  return (
    <section className="rounded-xl bg-white p-4">
      <Section
        title="Scheduled Transfers"
        action={
          <a href="#" className="text-sm font-medium text-[#29A073] inline-flex items-center gap-1">
            View all
            <img src="/icons/arrowright.svg" alt="" className="w-4 h-4" />
          </a>
        }
      />
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : (
        <ul role="list" className="space-y-3">
          {data.map((t) => (
            <li key={t.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500 mt-2">{formatDate(t.date)}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{formatMoney(t.amount)}</p>
            </li>
          ))}
          {data.length === 0 && (
            <li className="py-6 text-center text-sm text-gray-500">No scheduled transfers</li>
          )}
        </ul>
      )}
    </section>
  );
}
