"use client";

import React, { useState } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { FilterOption } from '@/types/filters';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MultiSelectFilterProps {
  label: string;
  options: FilterOption[];
  value: string[] | undefined;
  onChange: (value: string[] | undefined) => void;
  placeholder?: string;
}

export default function MultiSelectFilter({
  label,
  options,
  value = [],
  onChange,
  placeholder
}: MultiSelectFilterProps) {
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (optValue: string) => {
    const next = value.includes(optValue)
      ? value.filter(v => v !== optValue)
      : [...value, optValue];
    
    onChange(next.length > 0 ? next : undefined);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 px-3 bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-200 gap-2 font-bold",
            value.length > 0 && "border-blue-500/30 bg-blue-500/5 text-blue-400"
          )}
        >
          <span className="text-[10px] text-gray-500 uppercase tracking-widest mr-1">{label}</span>
          {value.length > 0 ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-blue-400">{value.length} selected</span>
              <div onClick={handleClear} className="p-0.5 hover:bg-blue-500/20 rounded-full transition-colors">
                <X className="h-3 w-3" />
              </div>
            </div>
          ) : (
            <span className="text-xs">{placeholder || 'All'}</span>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 bg-gray-900 border-gray-800 p-2 shadow-2xl">
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
          <Input
            placeholder="Search options..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 bg-gray-950 border-gray-800 text-xs text-gray-200 placeholder:text-gray-600 focus:ring-blue-500/20"
          />
        </div>
        <DropdownMenuSeparator className="bg-gray-800" />
        <div className="max-h-60 overflow-y-auto space-y-1 mt-2">
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-gray-600 text-[10px] font-black uppercase">No options found</div>
          ) : (
            filteredOptions.map(opt => (
              <div
                key={opt.value}
                onClick={() => handleToggle(opt.value)}
                className={cn(
                  "flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors",
                  value.includes(opt.value) ? "bg-blue-600/10" : "hover:bg-gray-800"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "w-3.5 h-3.5 rounded border border-gray-700 flex items-center justify-center transition-all duration-200",
                    value.includes(opt.value) ? "bg-blue-600 border-blue-600" : "bg-gray-950"
                  )}>
                    {value.includes(opt.value) && <Check className="h-2.5 w-2.5 text-white" />}
                  </div>
                  {opt.color && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: opt.color }} />}
                  <span className={cn(
                    "text-xs font-bold transition-colors",
                    value.includes(opt.value) ? "text-blue-400" : "text-gray-400"
                  )}>
                    {opt.label}
                  </span>
                </div>
                {opt.count !== undefined && (
                  <span className="text-[10px] font-black text-gray-600 tabular-nums">
                    {opt.count}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
        {value.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-gray-800 mt-2" />
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-8 mt-1 text-[10px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-500/10 hover:text-blue-300"
              onClick={() => onChange(undefined)}
            >
              Clear selection
            </Button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
