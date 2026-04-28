"use client";

import React from 'react';
import { X } from 'lucide-react';
import { FilterChip } from '@/types/filters';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FilterChipsProps {
  chips: FilterChip[];
  onClearAll: () => void;
}

export default function FilterChips({ chips, onClearAll }: FilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest mr-1">Active Filters:</span>
      {chips.map((chip) => (
        <div
          key={chip.id}
          className={cn(
            "group flex items-center gap-2 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full",
            "text-[10px] font-bold text-blue-300 transition-all duration-200 hover:border-blue-500/40"
          )}
        >
          {chip.color && <div className="w-1 h-1 rounded-full shadow-[0_0_4px] shadow-current" style={{ backgroundColor: chip.color, color: chip.color }} />}
          <span>{chip.label}</span>
          <button
            onClick={chip.onRemove}
            className="p-0.5 rounded-full hover:bg-blue-500/20 text-blue-400 hover:text-blue-200 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      {chips.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-7 px-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
