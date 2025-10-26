'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface InsurerBarChartProps {
  data: {
    insurer: string;
    avgDays: number;
  }[];
}

export function InsurerBarChart({ data }: InsurerBarChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="insurer"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            style={{ fontSize: '12px' }}
            label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="avgDays"
            fill="#8b5cf6"
            name="Avg Approval Time (Days)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
