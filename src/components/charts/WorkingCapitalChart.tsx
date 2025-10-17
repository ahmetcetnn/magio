'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useSettings } from '../../providers/settings-context';

type Point = { date: string; income: number; expenses: number };

export default function WorkingCapitalChart({ data }: { data: Point[] }) {
  const { formatDate, formatMoney } = useSettings();

  const safeFormat = React.useCallback(
    (d: any, opts?: Intl.DateTimeFormatOptions) => {
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return String(d);
      return formatDate(dt, opts);
    },
    [formatDate]
  );

  return (
    <figure className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 p-4">
      <figcaption className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900">Working Capital</h3>
        </div>
        <span className="text-xs text-gray-500">Last 7 days</span>
      </figcaption>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d: string | number) => safeFormat(d, { month: 'short', day: '2-digit' })}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              tickFormatter={(v: number) => formatMoney(v, { currencyDisplay: 'code' }).replace(/[^0-9,.]/g, '')}
              width={40}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{ borderRadius: 8 }}
              formatter={(value: any, name: string) => [formatMoney(value as number), name]}
              labelFormatter={(label) => safeFormat(label)}
            />
            <Line type="monotone" dataKey="income" stroke="#C8EE44" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="expenses" stroke="#94A3B8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
