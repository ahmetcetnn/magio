import React from 'react';
import { RecentTransactions, ScheduledTransfers, Transaction, Transfer } from '../lists/Transactions';

export default function TransactionsPanel({
  loading,
  recent,
  scheduled,
}: {
  loading: boolean;
  recent: Transaction[];
  scheduled: Transfer[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <RecentTransactions data={recent} loading={loading} />
      <ScheduledTransfers data={scheduled} loading={loading} />
    </div>
  );
}
