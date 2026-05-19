"use client";

import React from 'react';
import { Granularity } from '@/types/layout';
import { cn } from '@/lib/utils';

interface GranularityToggleProps {
  value: Granularity;
  onChange: (g: Granularity) => void;
}

const OPTIONS: Granularity[] = ['hourly', 'daily', 'weekly', 'monthly'];

export default function GranularityToggle({ value, onChange }: GranularityToggleProps) {
  return (
    <div className="flex items-center bg-gray-950 p-1 rounded-lg border border-gray-800 shadow-inner">
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-tight transition-all duration-200",
            value === opt 
              ? "bg-gray-800 text-blue-400 shadow-lg ring-1 ring-white/5" 
              : "text-gray-600 hover:text-gray-400 hover:bg-gray-900/50"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
