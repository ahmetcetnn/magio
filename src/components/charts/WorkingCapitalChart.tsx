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
type Range = 'last_7_days' | 'last_1_month' | 'last_1_year';

export default function WorkingCapitalChart({
  data,
  range: controlledRange,
  onRangeChange,
}: {
  data: Point[];
  range?: Range;
  onRangeChange?: (r: Range) => void;
}) {
  const { formatDate, formatMoney } = useSettings();
  const [range, setRange] = React.useState<Range>(controlledRange || 'last_7_days');

  React.useEffect(() => {
    if (controlledRange) setRange(controlledRange);
  }, [controlledRange]);

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
      <figcaption className="mb-3 grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
        <div className="justify-self-start">
          <h3 className="text-base font-semibold text-gray-900">Working Capital</h3>
        </div>
        <div className="hidden sm:flex items-center justify-center gap-6">
          <span className="inline-flex items-center gap-2 text-sm text-gray-700">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#C8EE44' }} />
            Income
          </span>
          <span className="inline-flex items-center gap-2 text-sm text-gray-700">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#94A3B8' }} />
            Expenses
          </span>
        </div>
        <div className="justify-self-end">
          <label className="sr-only" htmlFor="wc-range">Select range</label>
          <select
            id="wc-range"
            value={range}
            onChange={(e) => {
              const val = e.target.value as Range;
              setRange(val);
              onRangeChange?.(val);
            }}
            className="text-sm text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-lime-400"
          >
            <option value="last_7_days">Last 7 days</option>
            <option value="last_1_month">Last 1 month</option>
            <option value="last_1_year">Last 1 year</option>
          </select>
        </div>
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
              tickFormatter={(v: number) => {
                const abs = Math.abs(v);
                if (abs >= 1000) {
                  const rounded = Math.round((v / 1000) * 10) / 10;
                  const label = Number.isInteger(rounded) ? `${rounded.toFixed(0)}k` : `${rounded}k`;
                  return label;
                }
                return `${v}`;
              }}
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
