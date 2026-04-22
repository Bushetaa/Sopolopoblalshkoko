"use client";

import React from 'react';
import { DateRange } from '@/types/layout';
import { subDays, subMonths, format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (r: DateRange) => void;
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const presets = [
    { label: 'Last 24h', getValue: () => ({ from: subDays(new Date(), 1), to: new Date() }) },
    { label: 'Last 7d', getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
    { label: 'Last 30d', getValue: () => ({ from: subMonths(new Date(), 1), to: new Date() }) },
  ];

  return (
    <div className="flex items-center gap-2 bg-gray-950 p-1 rounded-xl border border-gray-800">
      <div className="flex items-center">
        {presets.map((preset) => {
          const isActive = format(value.from, 'yyyy-MM-dd') === format(preset.getValue().from, 'yyyy-MM-dd');
          return (
            <button
              key={preset.label}
              onClick={() => onChange(preset.getValue())}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                isActive 
                  ? "bg-gray-800 text-gray-50 shadow-sm" 
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
      <div className="w-[1px] h-4 bg-gray-800 mx-1" />
      <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-gray-200 transition-colors">
        <CalendarIcon className="h-3.5 w-3.5" />
        <span>{format(value.from, 'MMM dd')} - {format(value.to, 'MMM dd')}</span>
        <ChevronDown className="h-3 w-3" />
      </button>
    </div>
  );
}
