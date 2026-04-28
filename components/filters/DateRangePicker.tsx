"use client";

import React from 'react';
import { CalendarDays, ChevronDown, Check } from 'lucide-react';
import { DATE_PRESETS, DateRangeFilter, getPresetLabel } from '@/lib/date-presets';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  value: DateRangeFilter;
  onChange: (range: DateRangeFilter) => void;
  align?: 'start' | 'center' | 'end';
}

export default function DateRangePicker({ 
  value, 
  onChange, 
  align = 'end' 
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handlePresetClick = (preset: typeof DATE_PRESETS[number]) => {
    const range = preset.getRange();
    onChange({
      preset: preset.value,
      startDate: range.start,
      endDate: range.end,
      granularity: value.granularity
    });
    setIsOpen(false);
  };

  const handleCalendarChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      onChange({
        preset: 'custom',
        startDate: range.from,
        endDate: range.to,
        granularity: value.granularity
      });
    } else if (range?.from) {
      onChange({
        preset: 'custom',
        startDate: range.from,
        endDate: null,
        granularity: value.granularity
      });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex items-center gap-2 px-3 py-2 bg-gray-900 border-gray-800",
            "text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-all duration-150",
            isOpen && "border-blue-500/50 bg-gray-800"
          )}
        >
          <CalendarDays className="h-4 w-4 text-gray-500" />
          <span className="font-bold">{getPresetLabel(value)}</span>
          <ChevronDown className={cn("h-3.5 w-3.5 text-gray-500 transition-transform duration-200", isOpen && "rotate-180")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto p-0 bg-gray-900 border-gray-800 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Presets Sidebar */}
        <div className="w-48 border-r border-gray-800 p-2 bg-gray-950/50">
          <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-3 py-2 mb-1">
            Quick Presets
          </div>
          <div className="space-y-1">
            {DATE_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePresetClick(preset)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors text-left",
                  value.preset === preset.value 
                    ? "bg-blue-600/10 text-blue-400" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                )}
              >
                {preset.label}
                {value.preset === preset.value && <Check className="h-3 w-3" />}
              </button>
            ))}
            <button
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors text-left",
                value.preset === 'custom' 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              )}
            >
              Custom Range
              {value.preset === 'custom' && <Check className="h-3 w-3" />}
            </button>
          </div>
        </div>

        {/* Calendar Picker */}
        <div className="p-3 bg-gray-900">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value.startDate || undefined}
            selected={{
              from: value.startDate || undefined,
              to: value.endDate || undefined,
            }}
            onSelect={handleCalendarChange}
            numberOfMonths={2}
            className="rounded-md border-none"
          />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
            <div className="text-[10px] text-gray-500 font-bold uppercase">
              {value.startDate && value.endDate ? (
                <span>Range selected</span>
              ) : value.startDate ? (
                <span>Select end date</span>
              ) : (
                <span>Select start date</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs font-bold text-gray-500 hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
                onClick={() => setIsOpen(false)}
                disabled={!value.startDate || !value.endDate}
              >
                Apply Range
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
