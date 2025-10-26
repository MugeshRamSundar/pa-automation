'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TrendLineChartProps {
  data: {
    date: string;
    submitted: number;
    approved: number;
    denied: number;
  }[];
}

export function TrendLineChart({ data }: TrendLineChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            style={{ fontSize: '12px' }}
          />
          <YAxis style={{ fontSize: '12px' }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="submitted"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Submitted"
          />
          <Line
            type="monotone"
            dataKey="approved"
            stroke="#10b981"
            strokeWidth={2}
            name="Approved"
          />
          <Line
            type="monotone"
            dataKey="denied"
            stroke="#ef4444"
            strokeWidth={2}
            name="Denied"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
