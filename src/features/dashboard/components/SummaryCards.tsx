import React from 'react';
import { SummaryCard, Skeleton } from '../../../components/ui/cards';
import { useSettings } from '../../../providers/settings-context';

export default function SummaryCards({
  loading,
  totals,
}: {
  loading: boolean;
  totals: { balance: number; spending: number; saved: number };
}) {
  const { formatMoney } = useSettings();
  const [active, setActive] = React.useState<'balance' | 'spending' | 'saved'>('balance');
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {loading ? (
        <>
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </>
      ) : (
        <>
          <SummaryCard
            title="Total balance"
            value={formatMoney(totals.balance)}
            active={active === 'balance'}
            onClick={() => setActive('balance')}
            iconSrc="/icons/wallet-add.12 1.svg"
          />
          <SummaryCard
            title="Total spending"
            value={formatMoney(totals.spending)}
            active={active === 'spending'}
            onClick={() => setActive('spending')}
            iconSrc="/icons/wallet-add.12 1.svg"
          />
          <SummaryCard
            title="Total saved"
            value={formatMoney(totals.saved)}
            active={active === 'saved'}
            onClick={() => setActive('saved')}
            iconSrc="/icons/wallet2.svg"
          />
        </>
      )}
    </div>
  );
}
