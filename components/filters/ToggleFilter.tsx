"use client";

import React from 'react';
import { FilterOption } from '@/types/filters';
import { cn } from '@/lib/utils';

interface ToggleFilterProps {
  label: string;
  options: FilterOption[];
  value: string[] | undefined;
  onChange: (value: string[] | undefined) => void;
}

export default function ToggleFilter({
  label,
  options,
  value = [],
  onChange
}: ToggleFilterProps) {
  const handleToggle = (optValue: string) => {
    const next = value.includes(optValue)
      ? value.filter(v => v !== optValue)
      : [...value, optValue];
    
    onChange(next.length > 0 ? next : undefined);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{label}</span>
      <div className="flex items-center p-1 bg-gray-950/50 border border-gray-800 rounded-xl">
        {options.map((opt) => {
          const isActive = value.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => handleToggle(opt.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
                isActive 
                  ? "bg-gray-800 text-gray-50 shadow-lg shadow-black/20 ring-1 ring-white/5" 
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              {opt.color && (
                <div 
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-transform duration-300",
                    isActive ? "scale-110 shadow-[0_0_8px] shadow-current" : "opacity-40"
                  )} 
                  style={{ backgroundColor: opt.color, color: opt.color }} 
                />
              )}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
