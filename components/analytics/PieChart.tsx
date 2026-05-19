"use client";

import React from 'react';
import { PieChart as ReChartsPie, Pie, Cell, ResponsiveContainer, Tooltip, Label } from 'recharts';
import { RequestDistributionData } from '@/types/layout';

interface RequestDistributionChartProps {
  data: RequestDistributionData[];
  isLoading?: boolean;
}

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl ring-1 ring-white/5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="text-xs font-bold text-gray-200">{data.name}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400 font-medium">
            {(data.value / 1000).toFixed(1)}k Requests
          </span>
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
            {data.percentage}% Share
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function RequestDistributionChart({ data, isLoading }: RequestDistributionChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const formattedTotal = total >= 1000000 ? `${(total / 1000000).toFixed(1)}M` : `${(total / 1000).toFixed(0)}k`;

  if (isLoading) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 h-[400px] flex items-center justify-center animate-pulse">
        <div className="w-48 h-48 rounded-full border-[12px] border-gray-800 flex items-center justify-center">
          <div className="w-16 h-8 bg-gray-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-5 hover:border-gray-700 transition-all duration-300 relative overflow-hidden group/pie h-full flex flex-col shadow-2xl">
      <h3 className="text-lg font-black text-gray-50 tracking-tight mb-0.5">Distribution</h3>
      <p className="text-[10px] text-gray-500 font-bold tracking-wide mb-4">Traffic by protocol</p>

      <div className="flex-1 min-h-[180px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ReChartsPie>
            <Tooltip content={<PieTooltip />} />
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
              <Label
                value={formattedTotal}
                position="center"
                content={({ viewBox: { cx, cy } }: any) => (
                  <g>
                    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
                      <tspan x={cx} dy="-0.4em" className="fill-gray-50 text-xl font-black tracking-tight">{formattedTotal}</tspan>
                      <tspan x={cx} dy="1.4em" className="fill-gray-500 text-[8px] font-black uppercase tracking-widest">Total</tspan>
                    </text>
                  </g>
                )}
              />
            </Pie>
          </ReChartsPie>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-800/30 transition-colors border border-transparent hover:border-white/5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter leading-none mb-0.5">{item.name}</span>
              <span className="text-[9px] font-bold text-gray-500">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
